// path: src/app/admin/dashboard/page.tsx
export default function DashboardPage() {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="mt-2 text-gray-600">Bienvenue sur votre espace d'administration.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-500">Ventes (30j)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0 €</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-500">Commandes (30j)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
        </div>
      </div>
    );
  }