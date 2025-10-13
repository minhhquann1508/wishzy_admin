import {
    Breadcrumb,
    Input,
    Button,
    Space,
    Avatar,
    Dropdown,
    Badge,
    Layout,
    Typography,
    Menu
} from 'antd';
import type { MenuProps } from 'antd'; // Thêm dòng này
import {
    HomeOutlined,
    UserOutlined,
    SearchOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
    MailOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    // Menu dropdown cho thông báo
    const notificationItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar icon={<MailOutlined />} />
                    <div>
                        <Text strong>Bạn có thông báo mới</Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>10 phút trước</Text>
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar icon={<MailOutlined />} />
                    <div>
                        <Text strong>Cập nhật hệ thống</Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>2 giờ trước</Text>
                    </div>
                </div>
            ),
        },
    ];

    // Menu dropdown cho user
    const userItems: MenuProps['items'] = [
        {
            key: '1',
            label: 'Thông tin tài khoản',
            icon: <UserOutlined />,
        },
        {
            key: '2',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    return (
        <Header style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0'
        }}>
            {/* Phần bên trái - Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },
                    {
                        href: '',
                        title: (
                            <>
                                <UserOutlined />
                                <span>Home</span>
                            </>
                        ),
                    },
                    {
                        title: 'Dashboard',
                    },
                ]}
            />

            {/* Phần bên phải - Search và User actions */}
            <Space size="middle">
                {/* Thanh tìm kiếm */}
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    style={{ width: 200 }}
                    allowClear
                />

                {/* Nút thông báo */}
                <Dropdown menu={{ items: notificationItems }} trigger={['click']}>
                    <Badge count={5} size="small">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<BellOutlined />}
                            style={{ color: '#595959' }}
                        />
                    </Badge>
                </Dropdown>

                {/* User dropdown */}
                <Dropdown menu={{ items: userItems }} trigger={['click']}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 8px',
                        cursor: 'pointer',
                        borderRadius: 4
                    }}>
                        <Avatar
                            size="small"
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                        <Text style={{ display: 'none' }} className="md:block">Nguyễn Văn A</Text>
                    </div>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default Navbar;