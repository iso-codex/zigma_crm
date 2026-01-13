export type UserRole = 'admin' | 'staff' | 'investor';

export interface RolePermissions {
    // Dashboard & Analytics
    viewAdminDashboard: boolean;
    viewInvestorPortal: boolean;

    // Investors Management
    viewInvestors: boolean;
    createInvestor: boolean;
    editInvestor: boolean;
    deleteInvestor: boolean;

    // Funds Management
    viewFunds: boolean;
    createFund: boolean;
    editFund: boolean;
    deleteFund: boolean;

    // Opportunities
    viewOpportunities: boolean;
    createOpportunity: boolean;
    editOpportunity: boolean;
    deleteOpportunity: boolean;

    // Leads
    viewLeads: boolean;
    createLead: boolean;
    editLead: boolean;
    deleteLead: boolean;

    // Reports & Documents
    viewAllReports: boolean;
    downloadStatements: boolean;

    // System Settings
    manageUsers: boolean;
    manageRoles: boolean;
    systemSettings: boolean;
}

const rolePermissionsMap: Record<UserRole, RolePermissions> = {
    admin: {
        // Full access to everything
        viewAdminDashboard: true,
        viewInvestorPortal: true,
        viewInvestors: true,
        createInvestor: true,
        editInvestor: true,
        deleteInvestor: true,
        viewFunds: true,
        createFund: true,
        editFund: true,
        deleteFund: true,
        viewOpportunities: true,
        createOpportunity: true,
        editOpportunity: true,
        deleteOpportunity: true,
        viewLeads: true,
        createLead: true,
        editLead: true,
        deleteLead: true,
        viewAllReports: true,
        downloadStatements: true,
        manageUsers: true,
        manageRoles: true,
        systemSettings: true,
    },
    staff: {
        // Limited access - can view and edit but not delete
        viewAdminDashboard: true,
        viewInvestorPortal: false,
        viewInvestors: true,
        createInvestor: true,
        editInvestor: true,
        deleteInvestor: false,
        viewFunds: true,
        createFund: false,
        editFund: true,
        deleteFund: false,
        viewOpportunities: true,
        createOpportunity: true,
        editOpportunity: true,
        deleteOpportunity: false,
        viewLeads: true,
        createLead: true,
        editLead: true,
        deleteLead: false,
        viewAllReports: true,
        downloadStatements: true,
        manageUsers: false,
        manageRoles: false,
        systemSettings: false,
    },
    investor: {
        // Only personal portfolio access
        viewAdminDashboard: false,
        viewInvestorPortal: true,
        viewInvestors: false,
        createInvestor: false,
        editInvestor: false,
        deleteInvestor: false,
        viewFunds: false,
        createFund: false,
        editFund: false,
        deleteFund: false,
        viewOpportunities: false,
        createOpportunity: false,
        editOpportunity: false,
        deleteOpportunity: false,
        viewLeads: false,
        createLead: false,
        editLead: false,
        deleteLead: false,
        viewAllReports: false,
        downloadStatements: true,
        manageUsers: false,
        manageRoles: false,
        systemSettings: false,
    },
};

export const getRolePermissions = (role: UserRole): RolePermissions => {
    return rolePermissionsMap[role];
};

export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
    return rolePermissionsMap[role][permission];
};

export const getDefaultRoute = (role: UserRole): string => {
    switch (role) {
        case 'admin':
        case 'staff':
            return '/dashboard';
        case 'investor':
            return '/investor/dashboard';
        default:
            return '/login';
    }
};
