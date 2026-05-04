export type PortfolioUser = {
    id: number;
    client_id?: number;
    first_name: string;
    last_name: string;
    email: string;
    identity_type: 'employee' | 'client';
    is_admin?: boolean;
    permissions: string[];
};

/** A regular bank client */
export const clientUser: PortfolioUser = {
    id: 1001,
    client_id: 1001,
    first_name: 'Marko',
    last_name: 'Markovic',
    email: 'marko.markovic@example.com',
    identity_type: 'client',
    permissions: [],
};

/**
 * An admin / super-admin employee.
 * Having 'admin' in permissions makes isSuperAdmin=true inside usePermissions,
 * which grants canManageOTC, canExercise and canViewOptions – the full portfolio.
 */
export const adminUser: PortfolioUser = {
    id: 9003,
    first_name: 'Ana',
    last_name: 'Admin',
    email: 'admin@raf.rs',
    identity_type: 'employee',
    is_admin: true,
    permissions: ['admin', 'employee.update'],
};

/**
 * An actuary / agent employee.
 * Has options exercise + view permissions and 'trading', so isAgent=true
 * but canManageOTC=false (no OTC Public buttons).
 */
export const actuaryUser: PortfolioUser = {
    id: 9005,
    first_name: 'Milan',
    last_name: 'Aktuar',
    email: 'aktuar@raf.rs',
    identity_type: 'employee',
    is_admin: false,
    permissions: ['portfolio.options.exercise', 'portfolio.options.view', 'trading'],
};

/** One STOCK asset with 10 shares */
export const msftStock = {
    assetId: 101,
    id: 101,
    ticker: 'MSFT',
    type: 'STOCK',
    amount: 10,
    pricePerUnitRSD: 17_500,
    price: 17_500,
    profit: 5_000,
    lastModified: '2025-03-01T00:00:00Z',
    isPublic: false,
};

/** A PUT option that is in-the-money and has not expired */
export const msftOptionITM = {
    assetId: 201,
    id: 201,
    ticker: 'MSFT-PUT',
    type: 'OPTION',
    optionType: 'PUT',
    strike: 450,
    price: 25,
    current: 380,
    settlement: '2027-12-31',
    status: 'ITM',
    amount: 1,
    profit: 700,
    pricePerUnitRSD: 2_500,
    lastModified: '2025-03-01T00:00:00Z',
    isPublic: false,
};

/** A bank account returned by GET /clients/{id}/accounts */
export const mockAccount = {
    account_number: '1234567890',
    name: 'Tekući račun',
    balance: 150_000,
    currency: 'RSD',
};

// ─── helpers ───────────────────────────────────────────────────────────────

/**
 * Visit `path` with the given user's auth already in localStorage,
 * bypassing the real login flow.
 */
export function loginAs(user: PortfolioUser, path: string): void {
    cy.visit(path, {
        onBeforeLoad(win: Window) {
            win.localStorage.setItem('token', 'test-token');
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
            win.localStorage.setItem('user', JSON.stringify(user));
        },
    });
}

/** Intercept the client portfolio GET (tradingApi /client/{id}/assets). */
export function interceptClientPortfolio(
    assets: object[],
    tax = { taxPaid: 1_200, taxUnpaid: 350 },
): void {
    cy.intercept('GET', /\/client\/[^/]+\/assets/, {
        statusCode: 200,
        body: { assets, tax },
    }).as('getPortfolio');
}

/** Intercept the actuary portfolio GET (tradingApi /actuary/{id}/assets). */
export function interceptActuaryPortfolio(
    assets: object[],
    tax = { taxPaid: 0, taxUnpaid: 0 },
): void {
    cy.intercept('GET', /\/actuary\/[^/]+\/assets/, {
        statusCode: 200,
        body: { assets, tax },
    }).as('getPortfolio');
}

/** Intercept the client accounts GET (bankingApi /clients/{id}/accounts). */
export function interceptClientAccounts(): void {
    cy.intercept('GET', /\/clients\/[^/]+\/accounts/, {
        statusCode: 200,
        body: { data: [mockAccount] },
    }).as('getAccounts');
}