
import React from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Wallet,
    ChartNoAxesCombined,
    Users,
    Target,
    Settings,
    Search,
    Bell,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Menu,
    Download,
    Upload,
    Heart,
    Eye,
    Euro,
    Boxes,
    ShieldCheck,
} from 'lucide-react';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';

type Product = {
    id: number;
    title: string;
    category: string;
    buy_price: number;
    sell_price: number;
    status: string;
    views: number;
    favorites: number;
};

type Sale = {
    id: number;
    product_title: string;
    buyer: string;
    amount: number;
    fees: number;
    sold_at: string;
};


const seedProducts: Product[] = [
    {
        id: 1,
        title: 'Veste vintage en jean',
        category: 'Vêtements',
        buy_price: 8,
        sell_price: 32,
        status: 'En ligne',
        views: 248,
        favorites: 19,
    },
    {
        id: 2,
        title: 'Sac bandoulière noir',
        category: 'Accessoires',
        buy_price: 12,
        sell_price: 38,
        status: 'En ligne',
        views: 186,
        favorites: 24,
    },
    {
        id: 3,
        title: 'Baskets blanches',
        category: 'Chaussures',
        buy_price: 15,
        sell_price: 45,
        status: 'Réservé',
        views: 312,
        favorites: 31,
    },
    {
        id: 4,
        title: 'Pull col rond beige',
        category: 'Vêtements',
        buy_price: 6,
        sell_price: 24,
        status: 'En ligne',
        views: 97,
        favorites: 8,
    },
    {
        id: 5,
        title: 'Lunettes rétro',
        category: 'Accessoires',
        buy_price: 4,
        sell_price: 18,
        status: 'Vendu',
        views: 154,
        favorites: 12,
    },
];

const seedSales: Sale[] = [
    {
        id: 1,
        product_title: 'Chemise oversize',
        buyer: 'Camille D.',
        amount: 28,
        fees: 2.8,
        sold_at: '2026-11-09',
    },
    {
        id: 2,
        product_title: 'Sac bandoulière',
        buyer: 'Alex M.',
        amount: 38,
        fees: 3.8,
        sold_at: '2026-11-08',
    },
    {
        id: 3,
        product_title: 'Jean droit vintage',
        buyer: 'Sarah L.',
        amount: 34,
        fees: 3.4,
        sold_at: '2026-11-07',
    },
];

const nav = [
    ['Vue d’ensemble', LayoutDashboard],
    ['Articles', Package],
    ['Ventes', ShoppingBag],
    ['Comptabilité', Wallet],
    ['Statistiques', ChartNoAxesCombined],
    ['Acheteurs', Users],
    ['Objectifs', Target],
    ['Paramètres', Settings],
] as const;

const chart = [
    { d: 'Lun', v: 120 },
    { d: 'Mar', v: 185 },
    { d: 'Mer', v: 145 },
    { d: 'Jeu', v: 260 },
    { d: 'Ven', v: 210 },
    { d: 'Sam', v: 320 },
    { d: 'Dim', v: 285 },
];

const euro = (n: number) =>
    n.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    });

export default function App() {
    const [page, setPage] = useState('Vue d’ensemble');
    const [products, setProducts] = useState(seedProducts);
    const [sales, setSales] = useState(seedSales);
    const [query, setQuery] = useState('');
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [api, setApi] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8787/api/health')
            .then((r) => r.ok && setApi(true))
            .catch(() => setApi(false));
    }, []);

    const revenue = sales.reduce((s, x) => s + x.amount, 0);
    const profit = sales.reduce((s, x) => s + x.amount - x.fees, 0);

    const filtered = useMemo(
        () =>
            products.filter((p) =>
                p.title.toLowerCase().includes(query.toLowerCase())
            ),
        [products, query]
    );

    function addProduct(e: React.FormEvent) {
        e.preventDefault();

        if (!title || !price) {
            return;
        }

        setProducts((p) => [
            {
                id: Date.now(),
                title,
                category: 'Non classé',
                buy_price: 0,
                sell_price: Number(price),
                status: 'Brouillon',
                views: 0,
                favorites: 0,
            },
            ...p,
        ]);

        setTitle('');
        setPrice('');
        setModal(false);
    }

    function exportCSV() {
        const rows = [
            ['Article', 'Catégorie', 'Achat', 'Vente', 'Statut'],
            ...products.map((p) => [
                p.title,
                p.category,
                p.buy_price,
                p.sell_price,
                p.status,
            ]),
        ];

        const blob = new Blob(
            [rows.map((r) => r.join(';')).join('\n')],
            { type: 'text/csv;charset=utf-8' }
        );

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'openvintedbuddy-articles.csv';
        a.click();

        URL.revokeObjectURL(a.href);
    }

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brandmark">ov</div>

                    <div>
                        <b>OpenVintedBuddy</b>
                        <small>Votre espace vendeur</small>
                    </div>
                </div>

                <div className="profile">
                    <div className="avatar">OV</div>

                    <div>
                        <b>Mon dressing</b>
                        <small>Compte local</small>
                    </div>

                    <span className="dot" />
                </div>

                <div className="navlabel">ESPACE DE TRAVAIL</div>

                <nav>
                    {nav.map(([label, Icon]) => (
                        <button
                            key={label}
                            className={page === label ? 'active' : ''}
                            onClick={() => setPage(label)}
                        >
                            <Icon size={18} />

                            <span>{label}</span>

                            {label === 'Ventes' && <em>3</em>}
                        </button>
                    ))}
                </nav>

                <div className="sidebottom">
                    <div className="sync">
                        <span className={api ? 'dot' : 'dot offline'} />

                        <div>
                            <b>
                                {api ? 'Backend connecté' : 'Mode local'}
                            </b>

                            <small>
                                {api
                                    ? 'API Go disponible'
                                    : 'Données de démonstration'}
                            </small>
                        </div>
                    </div>

                    <small>OpenVintedBuddy · v0.1.0</small>
                </div>
            </aside>

            <main className="main">
                <header>
                    <button className="mobilemenu">
                        <Menu />
                    </button>

                    <div className="crumb">
                        Espace vendeur <span>/</span> <b>{page}</b>
                    </div>

                    <div className="headright">
                        <div className="search">
                            <Search size={16} />

                            <input
                                placeholder="Rechercher un article..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <button className="iconbtn">
                            <Bell size={18} />
                            <i />
                        </button>

                        <div className="avatar small">OV</div>
                    </div>
                </header>

                <div className="content">

                    <div className="welcome">
                        <div>
                            <div className="eyebrow">
                                MARDI 10 NOVEMBRE 2026
                            </div>

                            <h1>
                                {page === 'Vue d’ensemble'
                                    ? 'Bonjour, bienvenue !'
                                    : page}
                            </h1>

                            <p>
                                {page === 'Vue d’ensemble'
                                    ? 'Voici un aperçu de l’activité de votre dressing.'
                                    : 'Retrouvez et gérez toutes vos données depuis cet espace.'}
                            </p>
                        </div>

                        <button
                            className="primary"
                            onClick={() => setModal(true)}
                        >
                            <Plus size={17} />
                            Ajouter un article
                        </button>
                    </div>

                    {page === 'Vue d’ensemble' && (
                        <>
                            <section className="metrics">
                                <Metric
                                    icon={<Euro />}
                                    label="Chiffre d’affaires"
                                    value={euro(revenue)}
                                    change="+12,8 %"
                                />

                                <Metric
                                    icon={<ShoppingBag />}
                                    label="Ventes réalisées"
                                    value={String(sales.length)}
                                    change="+2 cette semaine"
                                />

                                <Metric
                                    icon={<Package />}
                                    label="Articles en ligne"
                                    value={String(
                                        products.filter(
                                            (p) => p.status === 'En ligne'
                                        ).length
                                    )}
                                    change="Dans votre dressing"
                                />

                                <Metric
                                    icon={<Wallet />}
                                    label="Bénéfice estimé"
                                    value={euro(profit)}
                                    change="Après frais renseignés"
                                />
                            </section>

                            <section className="gridmain">
                                <div className="panel chartpanel">
                                    <div className="panelhead">
                                        <div>
                                            <h3>Évolution des ventes</h3>
                                            <p>
                                                Suivez votre chiffre d’affaires
                                            </p>
                                        </div>

                                        <select>
                                            <option>Cette semaine</option>
                                            <option>Ce mois</option>
                                            <option>Cette année</option>
                                        </select>
                                    </div>

                                    <div className="chart">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={chart}>
                                                <defs>
                                                    <linearGradient
                                                        id="fill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#08a0a8"
                                                            stopOpacity={0.22}
                                                        />

                                                        <stop
                                                            offset="100%"
                                                            stopColor="#08a0a8"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#edf1f1"
                                                />

                                                <XAxis
                                                    dataKey="d"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill: '#91a0a2',
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Tooltip
                                                    formatter={(v) =>
                                                        euro(Number(v))
                                                    }
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="v"
                                                    stroke="#07969f"
                                                    strokeWidth={2.5}
                                                    fill="url(#fill)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="panel quickpanel">
                                    <div className="panelhead">
                                        <div>
                                            <h3>
                                                Performance du dressing
                                            </h3>
                                            <p>
                                                Indicateurs de visibilité
                                            </p>
                                        </div>

                                        <span className="tag">7 jours</span>
                                    </div>

                                    <Mini
                                        icon={<Eye />}
                                        label="Vues des articles"
                                        value="1 248"
                                    />

                                    <Mini
                                        icon={<Heart />}
                                        label="Favoris reçus"
                                        value="94"
                                    />

                                    <Mini
                                        icon={<Boxes />}
                                        label="Articles disponibles"
                                        value={String(
                                            products.filter(
                                                (p) => p.status === 'En ligne'
                                            ).length
                                        )}
                                    />

                                    <div className="hint">
                                        <ShieldCheck size={16} />
                                        Données calculées à partir des
                                        informations enregistrées dans le CRM.
                                    </div>
                                </div>
                            </section>

                            <section className="panel tablepanel">
                                <div className="panelhead">
                                    <div>
                                        <h3>Articles récents</h3>
                                        <p>
                                            Les dernières fiches de votre
                                            catalogue
                                        </p>
                                    </div>

                                    <button
                                        className="textbtn"
                                        onClick={() => setPage('Articles')}
                                    >
                                        Voir tout
                                        <ArrowUpRight size={15} />
                                    </button>
                                </div>

                                <ProductTable
                                    products={products.slice(0, 4)}
                                />
                            </section>
                        </>
                    )}

                    {page === 'Articles' && (
                        <section className="panel tablepanel">
                            <div className="panelhead">
                                <div>
                                    <h3>Catalogue des articles</h3>
                                    <p>
                                        {filtered.length} article(s) dans votre
                                        inventaire
                                    </p>
                                </div>

                                <div className="actions">
                                    <button
                                        className="secondary"
                                        onClick={exportCSV}
                                    >
                                        <Download size={16} />
                                        Exporter CSV
                                    </button>

                                    <button
                                        className="primary"
                                        onClick={() => setModal(true)}
                                    >
                                        <Plus size={16} />
                                        Ajouter
                                    </button>
                                </div>
                            </div>

                            <ProductTable products={filtered} />
                        </section>
                    )}

                    {page === 'Ventes' && (
                        <section className="panel tablepanel">
                            <div className="panelhead">
                                <div>
                                    <h3>Historique des ventes</h3>
                                    <p>
                                        Transactions enregistrées manuellement
                                        ou importées
                                    </p>
                                </div>

                                <button className="secondary">
                                    <Upload size={16} />
                                    Importer CSV
                                </button>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>ARTICLE</th>
                                        <th>ACHETEUR</th>
                                        <th>DATE</th>
                                        <th>MONTANT</th>
                                        <th>FRAIS</th>
                                        <th>STATUT</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sales.map((s) => (
                                        <tr key={s.id}>
                                            <td>
                                                <b>{s.product_title}</b>
                                            </td>

                                            <td>{s.buyer}</td>

                                            <td>
                                                {new Date(
                                                    s.sold_at
                                                ).toLocaleDateString('fr-FR')}
                                            </td>

                                            <td>
                                                <b>{euro(s.amount)}</b>
                                            </td>

                                            <td>{euro(s.fees)}</td>

                                            <td>
                                                <span className="status sold">
                                                    Terminée
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {page === 'Comptabilité' && (
                        <>
                            <section className="metrics">
                                <Metric
                                    icon={<Euro />}
                                    label="Chiffre d’affaires"
                                    value={euro(revenue)}
                                    change="Ventes enregistrées"
                                />

                                <Metric
                                    icon={<Wallet />}
                                    label="Frais renseignés"
                                    value={euro(
                                        sales.reduce(
                                            (a, s) => a + s.fees,
                                            0
                                        )
                                    )}
                                    change="À compléter selon transactions"
                                />

                                <Metric
                                    icon={<ChartNoAxesCombined />}
                                    label="Marge estimée"
                                    value={euro(profit)}
                                    change="Hors coût d'achat inconnu"
                                />

                                <Metric
                                    icon={<Boxes />}
                                    label="Valeur du stock"
                                    value={euro(
                                        products
                                            .filter(
                                                (p) => p.status === 'En ligne'
                                            )
                                            .reduce(
                                                (a, p) => a + p.buy_price,
                                                0
                                            )
                                    )}
                                    change="Au prix d'acquisition"
                                />
                            </section>

                            <div className="panel notice">
                                <ShieldCheck color="#07969f" />

                                <div>
                                    <b>Comptabilité indicative</b>

                                    <p>
                                        Les calculs dépendent des prix d'achat,
                                        frais et ventes saisis. Ils ne
                                        remplacent pas une comptabilité
                                        certifiée.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {page === 'Statistiques' && (
                        <section className="panel chartpanel">
                            <div className="panelhead">
                                <div>
                                    <h3>Activité hebdomadaire</h3>
                                    <p>
                                        Évolution du chiffre d’affaires
                                        enregistré
                                    </p>
                                </div>
                            </div>

                            <div className="chart tall">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart data={chart}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis dataKey="d" />

                                        <Tooltip
                                            formatter={(v) =>
                                                euro(Number(v))
                                            }
                                        />

                                        <Area
                                            dataKey="v"
                                            stroke="#07969f"
                                            fill="#dff4f2"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    )}

                    {page === 'Acheteurs' && (
                        <Empty
                            icon={<Users />}
                            title="Votre carnet d’acheteurs"
                            desc="Les acheteurs apparaîtront ici lorsque vous enregistrerez vos ventes."
                        />
                    )}

                    {page === 'Objectifs' && (
                        <Empty
                            icon={<Target />}
                            title="Vos objectifs"
                            desc="Définissez vos objectifs de chiffre d’affaires et de ventes dans une prochaine version."
                        />
                    )}

                    {page === 'Paramètres' && (
                        <section className="panel settings">
                            <h3>Paramètres de l’application</h3>

                            <div className="settingrow">
                                <div>
                                    <b>Stockage local</b>
                                    <p>
                                        Les données sont conservées dans votre
                                        base MariaDB locale lorsqu’elle est
                                        connectée.
                                    </p>
                                </div>

                                <span className="tag">Local</span>
                            </div>

                            <div className="settingrow">
                                <div>
                                    <b>Connecteur Vinted</b>
                                    <p>
                                        Inactif : aucun accès API officiel n’est
                                        configuré. Aucune donnée n’est extraite
                                        automatiquement du site.
                                    </p>
                                </div>

                                <span className="status pending">
                                    Non configuré
                                </span>
                            </div>

                            <div className="settingrow">
                                <div>
                                    <b>Backend Go</b>
                                    <p>
                                        Adresse locale :
                                        http://127.0.0.1:8787
                                    </p>
                                </div>

                                <span
                                    className={
                                        api ? 'status sold' : 'status pending'
                                    }
                                >
                                    {api ? 'Connecté' : 'Hors ligne'}
                                </span>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {modal && (
                <div
                    className="overlay"
                    onClick={() => setModal(false)}
                >
                    <form
                        className="modal"
                        onSubmit={addProduct}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="panelhead">
                            <div>
                                <h3>Ajouter un article</h3>
                                <p>
                                    Créer une fiche dans votre inventaire
                                </p>
                            </div>

                            <button
                                type="button"
                                className="iconbtn"
                                onClick={() => setModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <label>
                            Nom de l’article

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex. Veste en jean"
                                required
                            />
                        </label>

                        <label>
                            Prix de vente (€)

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="25,00"
                                required
                            />
                        </label>

                        <div className="modalactions">
                            <button
                                type="button"
                                className="secondary"
                                onClick={() => setModal(false)}
                            >
                                Annuler
                            </button>

                            <button className="primary">
                                Créer l’article
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function Metric({
    icon,
    label,
    value,
    change,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
}) {
    return (
        <div className="metric">
            <div className="metricicon">{icon}</div>

            <span>{label}</span>

            <strong>{value}</strong>

            <small>
                <ArrowUpRight size={13} />
                {change}
            </small>
        </div>
    );
}

function Mini({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="mini">
            <div className="miniicon">{icon}</div>

            <span>{label}</span>

            <b>{value}</b>
        </div>
    );
}

function ProductTable({
    products,
}: {
    products: Product[];
}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ARTICLE</th>
                    <th>CATÉGORIE</th>
                    <th>PRIX DE VENTE</th>
                    <th>VUES</th>
                    <th>FAVORIS</th>
                    <th>STATUT</th>
                </tr>
            </thead>

            <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td>
                            <div className="productcell">
                                <div className="productthumb">
                                    <Package size={17} />
                                </div>

                                <b>{p.title}</b>
                            </div>
                        </td>

                        <td>{p.category}</td>

                        <td>
                            <b>{euro(p.sell_price)}</b>
                        </td>

                        <td>{p.views}</td>

                        <td>{p.favorites}</td>

                        <td>
                            <span
                                className={
                                    'status ' +
                                    (p.status === 'Vendu'
                                        ? 'sold'
                                        : p.status === 'Réservé'
                                          ? 'pending'
                                          : 'live')
                                }
                            >
                                {p.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Empty({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="empty panel">
            <div>{icon}</div>

            <h3>{title}</h3>

            <p>{desc}</p>
        </div>
    );
}
