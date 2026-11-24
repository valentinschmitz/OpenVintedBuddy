package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

type Product struct {
	ID        int64   `json:"id"`
	Title     string  `json:"title"`
	Category  string  `json:"category"`
	BuyPrice  float64 `json:"buy_price"`
	SellPrice float64 `json:"sell_price"`
	Status    string  `json:"status"`
	Views     int     `json:"views"`
	Favorites int     `json:"favorites"`
}

func main() {
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		dsn = "ovb:ovb_local_change_me@tcp(127.0.0.1:3306)/openvintedbuddy?parseTime=true"
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	db.SetMaxOpenConns(8)
	db.SetConnMaxLifetime(3 * time.Minute)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(map[string]any{
			"status":   "ok",
			"database": db.Ping() == nil,
		})
	})

	mux.HandleFunc("GET /api/products", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.QueryContext(
			r.Context(),
			"SELECT id, title, category, buy_price, sell_price, status, views, favorites FROM products ORDER BY created_at DESC",
		)

		if err != nil {
			http.Error(w, "database unavailable", http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		out := []Product{}

		for rows.Next() {
			var p Product

			if rows.Scan(
				&p.ID,
				&p.Title,
				&p.Category,
				&p.BuyPrice,
				&p.SellPrice,
				&p.Status,
				&p.Views,
				&p.Favorites,
			) == nil {
				out = append(out, p)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(out)
	})

	mux.HandleFunc("POST /api/products", func(w http.ResponseWriter, r *http.Request) {
		var p Product

		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&p) != nil || p.Title == "" {
			http.Error(w, "invalid payload", http.StatusBadRequest)
			return
		}

		res, err := db.ExecContext(
			r.Context(),
			"INSERT INTO products(title, category, buy_price, sell_price, status) VALUES(?,?,?,?,?)",
			p.Title,
			p.Category,
			p.BuyPrice,
			p.SellPrice,
			"Brouillon",
		)

		if err != nil {
			http.Error(w, "database unavailable", http.StatusInternalServerError)
			return
		}

		p.ID, _ = res.LastInsertId()

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)

		json.NewEncoder(w).Encode(p)
	})

	handler := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://127.0.0.1:5173",
			"http://localhost:5173",
			"chrome-extension://*",
			"moz-extension://*",
		},
		AllowedMethods: []string{
			"GET",
			"POST",
			"OPTIONS",
		},
		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
		},
	}).Handler(mux)

	log.Println("OpenVintedBuddy API listening on 127.0.0.1:8787")

	log.Fatal(http.ListenAndServe("127.0.0.1:8787", handler))
}
