import './style.scss';

interface TabsProps {
    activeTab: number;
    setActiveTab: (tab: number) => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
    return (
        <div className="tab-container">
            <button type="button" className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
                Info
            </button>
            <button type="button" className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                Activity
            </button>
            {/*
            <button type="button" className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
                Photos?
            </button>
            */}
        </div>
    );
};

export default Tabs;
