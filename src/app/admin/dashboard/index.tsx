import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Row, Col } from 'antd';
import StatisticsChart from './charts/chart';

const AdminDashboard = () => {
    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <StatisticsChart />
                </Col>

                {/* Thêm các chart khác nếu cần */}
                {/* <Col span={12}>
          <StatisticsChart />
        </Col>
        <Col span={12}>
          <StatisticsChart />
        </Col> */}
            </Row>
        </div>
    );
};

export default AdminDashboard;