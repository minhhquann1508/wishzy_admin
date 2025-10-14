import {
    Space,
    Layout,
    Avatar,
    Dropdown,
    Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthUtils } from '@/utils/auth';
import { useNavigate } from 'react-router';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const navigate = useNavigate();
    const user = AuthUtils.getUser();

    const handleLogout = () => {
        AuthUtils.clearAuth();
        navigate('/');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <Header style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <Space>
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        padding: '4px 12px',
                        borderRadius: 6,
                        transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Avatar 
                            size="small" 
                            icon={<UserOutlined />} 
                            style={{ backgroundColor: '#1890ff' }}
                        />
                        <Text>{user?.email || 'User'}</Text>
                    </div>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default Navbar;