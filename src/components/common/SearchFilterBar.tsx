import React, { useState, useEffect } from "react";
import { Input, Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Search } = Input;

// ==================== INTERFACE ====================

export interface FilterValues {
  keyword: string;
  verified?: boolean | null;
}

interface SearchFilterBarProps {
  placeholder?: string;
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

// ==================== COMPONENT ====================

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  placeholder = "Tìm kiếm...",
  onFilterChange,
  initialFilters = { keyword: "" },
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, onFilterChange]);

  // ==================== HANDLERS ====================

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value.trim() }));
  };

  const handleReset = () => {
    setFilters({ keyword: "", verified: null });
  };

  const handleFilterChange: MenuProps["onClick"] = ({ key }) => {
    setFilters((prev) => ({
      ...prev,
      verified:
        key === "true" ? true : key === "false" ? false : null,
    }));
  };

  // ==================== MENU ====================

  const filterMenuItems: MenuProps["items"] = [
    { key: "all", label: "Tất cả" },
    { key: "true", label: "Đã xác thực" },
    { key: "false", label: "Chưa xác thực" },
  ];

  // ==================== RENDER ====================

  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Space
        size="middle"
        wrap
        style={{ display: "flex", alignItems: "center" }}
      >
        <Dropdown
          menu={{
            items: filterMenuItems,
            onClick: handleFilterChange,
            selectedKeys: [
              filters.verified === true
                ? "true"
                : filters.verified === false
                ? "false"
                : "all",
            ],
          }}
        >
          <Button icon={<FilterOutlined />}>Trạng thái</Button>
        </Dropdown>

        <Search
          placeholder={placeholder}
          allowClear
          value={filters.keyword}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 400 ,maxWidth: 400 }}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          type="default"
        >
          Làm mới
        </Button>
      </Space>
    </div>
  );
};

export default SearchFilterBar;
