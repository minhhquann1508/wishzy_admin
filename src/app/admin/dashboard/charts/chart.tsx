// import React from 'react';
// import { Card, Col, Row, Typography } from 'antd';
// import { BarChartOutlined } from '@ant-design/icons';
//
// const { Title, Text } = Typography;
//
// // Component biểu đồ mẫu - bạn có thể thay thế bằng thư viện chart thực tế
// const StatisticsChart = () => {
//     return (
//         <Card title="Thống kê dữ liệu" bordered={false}>
//             <div style={{ height: 300, textAlign: 'center', paddingTop: 120 }}>
//                 <BarChartOutlined style={{ fontSize: 48, color: '#1890ff' }} />
//                 <Title level={4}>Biểu đồ thống kê</Title>
//                 <Text type="secondary">Dữ liệu biểu đồ sẽ được hiển thị ở đây</Text>
//             </div>
//         </Card>
//     );
// };

// Nếu bạn muốn sử dụng thư viện chart thực sự như Chart.js, Recharts...
// Hãy bỏ comment và cài đặt thư viện tương ứng


import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = () => {
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(24, 144, 255, 0.5)',
      },
    ],
  };

  return <Bar data={data} />;
};


export default StatisticsChart;