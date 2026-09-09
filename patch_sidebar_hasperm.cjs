const fs = require('fs');
let text = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const original = `export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  watchlistCount,
  modelConfig,
  onOpenModelSettings,
  onRefreshAll,
  isRefreshing,
}) => {`;

const replaced = `export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  watchlistCount,
  modelConfig,
  onOpenModelSettings,
  onRefreshAll,
  isRefreshing,
}) => {
  const { hasPermission } = useAuth();`;

text = text.replace(original, replaced);

fs.writeFileSync('src/components/Sidebar.tsx', text);
