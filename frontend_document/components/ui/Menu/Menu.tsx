'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IDriveItem } from '@/types/driver';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';

interface MenuProps {
  allItems?: IDriveItem[];
  onMobileSearch?: (results: IDriveItem[] | null) => void;
}

const Menu = ({ allItems, onMobileSearch }: MenuProps) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const getActiveTab = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/document')) return 'document';
    if (pathname.startsWith('/contribute')) return 'contribute';
    return 'home';
  };

  useEffect(() => {
    if (allItems && onMobileSearch) {
      if (!searchQuery.trim()) {
        onMobileSearch(null);
      } else {
        const lower = searchQuery.toLowerCase();
        const filtered = allItems.filter(item =>
          item.name.toLowerCase().includes(lower)
        );
        onMobileSearch(filtered);
      }
    }
  }, [searchQuery, allItems, onMobileSearch]);

  const activeTab = getActiveTab();

  return (
    <nav>
      <div className="relative">
        <div className="absolute inset-0 duration-1000 opacity-30 transition-all bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur-xl filter group-hover:opacity-40 group-hover:duration-200 scale-110" />

        <StyledWrapper className="relative z-10" $activeTab={activeTab}>
          <div className="menu-container group">
            <div className="tab-container">
              <NavigationLink href="/" className={`tab-link ${activeTab === 'home' ? 'active' : ''}`}>
                <label className="tab_label">Trang chủ</label>
              </NavigationLink>
              <NavigationLink href="/document" className={`tab-link ${activeTab === 'document' ? 'active' : ''}`}>
                <label className="tab_label">Tài liệu</label>
              </NavigationLink>
              <NavigationLink href="/contribute" className={`tab-link ${activeTab === 'contribute' ? 'active' : ''}`}>
                <label className="tab_label">Đóng góp</label>
              </NavigationLink>
              <div className="indicator" />
            </div>

            {allItems && (
              <div className="search-container">
                <Input
                  allowClear
                  placeholder="Tìm kiếm..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                  size="middle"
                />
              </div>
            )}
          </div>
        </StyledWrapper>
      </div>
    </nav>
  );
};

const StyledWrapper = styled.div<{ $activeTab: string }>`
  .menu-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }
    
  .tab-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 3px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .search-container {
    position: relative;
  }

  .search-input {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 10px !important;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease !important;
    min-width: 200px;
  }

  .search-input:hover, .search-input:focus {
    background: rgba(255, 255, 255, 1) !important;
    border-color: #60a5fa !important;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2) !important;
  }

  .search-input .ant-input {
    background: transparent !important;
    border: none !important;
    color: #374151 !important;
    font-weight: 500;
  }

  .search-input .ant-input::placeholder {
    color: #9ca3af !important;
  }

  .tab-container::before {
    content: "";
    position: absolute;
    inset: -2px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3), rgba(244, 114, 182, 0.3), rgba(251, 191, 36, 0.3));
    border-radius: 14px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  .tab-container:hover::before {
    opacity: 0.8;
  }

  .tab-link {
    width: 140px;
    height: 36px;
    position: relative;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 9px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
  }

  .tab-link:hover {
    scale: 1.15;
  }

  .tab-link.active {
    transform: translateY(0px) scale(1.05);
  }

  .tab_label {
    font-size: 0.9rem;
    font-weight: 700;
    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .tab-link.active .tab_label {
    color: #ffffff;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .indicator {
    width: 140px;
    height: 36px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    position: absolute;
    z-index: 9;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 9px;
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateY(0) scale(1.01);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.08);
    ${({ $activeTab }) => {
    if ($activeTab === 'home') return `
        left: 5px;
        transform: translateY(0) scale(1.03);
        box-shadow: 0px 6px 20px rgba(59, 130, 246, 0.2), 0px 2px 6px rgba(59, 130, 246, 0.1);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(29, 78, 216, 0.8) 100%);
      `;
    if ($activeTab === 'document') return `
        left: calc(140px + 3px);
        transform: translateY(0) scale(1.02);
        box-shadow: 0px 6px 20px rgba(139, 92, 246, 0.2), 0px 2px 6px rgba(139, 92, 246, 0.1);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%);
      `;
    if ($activeTab === 'contribute') return `
        left: calc(140px * 2 + 2px);
        transform: translateY(0) scale(1.02);
        box-shadow: 0px 6px 20px rgba(236, 72, 153, 0.2), 0px 2px 6px rgba(236, 72, 153, 0.1);
        background: linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(219, 39, 119, 0.8) 100%);
      `;
    return '';
  }}
  }
`;

export default Menu;
