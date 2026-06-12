import { useState } from 'react'
import DealsTable from './DealsTable'
import DealsCategoryTable from './DealsCategoryTable'
import CreateDealForm from './CreateDealForm'

const tab = [
    { name: "Deals" },
    { name: "Categories" },
    { name: "Create Deal" }
]

const Deal = () => {
    const [activeTab, setActiveTab] = useState(tab[0].name);

    const handleActiveTab = (item: any) => {
        setActiveTab(item.name);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-5 border-b border-brand-gold/15">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                    Marketing
                </span>
                <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
                    Manage Deals &amp; Offers
                </h1>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex gap-2 border-b border-brand-gold/10 pb-px">
                {tab.map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleActiveTab(item)}
                            className={`px-5 py-2.5 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-200 ${
                                isActive
                                    ? "border-b-2 border-brand-gold text-brand-gold font-bold"
                                    : "text-charcoal/50 hover:text-matte-black"
                            }`}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>

            {/* Tab Panels */}
            <div className="mt-4">
                {activeTab === "Deals" && <DealsTable />}
                {activeTab === "Categories" && <DealsCategoryTable />}
                {activeTab === "Create Deal" && (
                    <div className="border border-brand-gold/15 bg-white p-6 max-w-2xl">
                        <CreateDealForm />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Deal