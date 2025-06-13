import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Typography, 
  Space,
  Avatar,
  Tag,
  Progress,
  Dropdown,
  Badge
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  PlusOutlined,
  RobotOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'interviews',
      icon: <FileTextOutlined />,
      label: 'Interviews',
    },
    {
      key: 'candidates',
      icon: <TeamOutlined />,
      label: 'Candidates',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const stats = [
    {
      title: 'Active Interviews',
      value: 24,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Completed Today',
      value: 8,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Pending Review',
      value: 12,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'orange',
      change: '-5%',
      trend: 'down'
    },
    {
      title: 'Total Candidates',
      value: 156,
      icon: <TeamOutlined className="text-purple-600" />,
      color: 'purple',
      change: '+23%',
      trend: 'up'
    }
  ];

  const recentInterviews = [
    {
      key: '1',
      candidate: 'Sarah Johnson',
      position: 'Frontend Developer',
      status: 'completed',
      score: 85,
      date: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
      duration: '45 min'
    },
    {
      key: '2',
      candidate: 'Michael Chen',
      position: 'Data Scientist',
      status: 'in-progress',
      score: null,
      date: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
      duration: '30 min'
    },
    {
      key: '3',
      candidate: 'Emily Rodriguez',
      position: 'UX Designer',
      status: 'pending',
      score: null,
      date: '2024-01-14',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
      duration: 'Not started'
    },
    {
      key: '4',
      candidate: 'David Kim',
      position: 'Backend Developer',
      status: 'completed',
      score: 92,
      date: '2024-01-14',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100',
      duration: '52 min'
    },
    {
      key: '5',
      candidate: 'Lisa Wang',
      position: 'Product Manager',
      status: 'completed',
      score: 78,
      date: '2024-01-13',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100',
      duration: '38 min'
    }
  ];

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: 'success', text: 'Completed' },
      'in-progress': { color: 'processing', text: 'In Progress' },
      pending: { color: 'warning', text: 'Pending' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const actionMenu = (record: any) => ({
    items: [
      {
        key: 'view',
        label: 'View Details',
        icon: <EyeOutlined />,
        onClick: () => navigate(`/interview/${record.key}`)
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: <EditOutlined />
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true
      }
    ]
  });

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} size="large" />
          <div>
            <div className="font-medium text-gray-800">{text}</div>
            <div className="text-sm text-gray-500">{record.position}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number | null) => 
        score ? (
          <div className="space-y-1">
            <Progress 
              percent={score} 
              size="small" 
              strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'}
              showInfo={false}
            />
            <div className="text-sm font-medium">{score}%</div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => (
        <span className="text-gray-600">{duration}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <span className="text-gray-600">{date}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => (
        <Dropdown menu={actionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Layout className="main-layout">
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="sidebar-layout"
        width={280}
      >
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">
            <RobotOutlined />
          </div>
          {!collapsed && (
            <span className="logo-text">Mirai</span>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="border-r-0 mt-4"
        />

        {/* Mirabot Status */}
        {!collapsed && (
          <div className="p-6 mt-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <div className="text-center">
                <div className="mirabot-avatar mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <RobotOutlined className="text-2xl text-white" />
                </div>
                <Title level={5} className="mb-2 text-indigo-800">Mirabot</Title>
                <Paragraph className="text-indigo-600 text-sm mb-0">
                  Ready to assist with your interviews!
                </Paragraph>
              </div>
            </Card>
          </div>
        )}
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="header-layout">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-6">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg hover:bg-gray-100"
              />
              <div>
                <Title level={4} className="mb-0 text-gray-800">
                  Dashboard
                </Title>
                <Paragraph className="text-gray-500 text-sm mb-0">
                  Welcome back, Alex! Here's what's happening today.
                </Paragraph>
              </div>
            </div>
            
            <Space size="large">
              <Button 
                icon={<SearchOutlined />}
                className="border-gray-300 hover:border-indigo-400"
              >
                Search
              </Button>
              <Badge count={3} size="small">
                <Button 
                  icon={<BellOutlined />}
                  className="border-gray-300 hover:border-indigo-400"
                />
              </Badge>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                className="btn-gradient"
                size="large"
              >
                New Interview
              </Button>
              <Avatar 
                src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100" 
                size="large"
                className="cursor-pointer border-2 border-indigo-200"
              />
            </Space>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="content-layout">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Welcome Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50">
              <Row align="middle" gutter={[24, 24]}>
                <Col flex="auto">
                  <Title level={3} className="mb-3 text-gray-800">
                    Welcome back, Alex! 👋
                  </Title>
                  <Paragraph className="text-gray-600 text-lg mb-4">
                    You have <strong>12 pending interviews</strong> to review and <strong>3 new candidates</strong> waiting for assessment.
                  </Paragraph>
                  <Space>
                    <Button type="primary" className="btn-gradient">
                      Review Pending
                    </Button>
                    <Button>View Analytics</Button>
                  </Space>
                </Col>
                <Col>
                  <div className="text-center">
                    <img 
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                      alt="AI Assistant"
                      className="w-24 h-24 rounded-full shadow-lg"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Stats Cards */}
            <Row gutter={[24, 24]}>
              {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="stats-card">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-3xl">
                          {stat.icon}
                        </div>
                        <Tag color={stat.trend === 'up' ? 'success' : 'error'} className="border-0">
                          {stat.change}
                        </Tag>
                      </div>
                      <Statistic
                        title={<span className="text-gray-600 font-medium">{stat.title}</span>}
                        value={stat.value}
                        valueStyle={{ 
                          color: '#1f2937',
                          fontSize: '2rem',
                          fontWeight: 'bold',
                          lineHeight: 1.2
                        }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Recent Interviews Table */}
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">Recent Interviews</Title>
                  <Button type="link" className="text-indigo-600 font-medium">
                    View All Interviews
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <Table
                columns={columns}
                dataSource={recentInterviews}
                pagination={false}
                className="custom-table"
                scroll={{ x: 800 }}
              />
            </Card>

            {/* Quick Actions */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title="Quick Actions" 
                  className="border-0 shadow-sm"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <Space direction="vertical" className="w-full" size="middle">
                    <Button 
                      type="primary" 
                      block 
                      size="large"
                      icon={<PlusOutlined />}
                      className="btn-gradient h-12"
                    >
                      Create New Interview
                    </Button>
                    <Button 
                      block 
                      size="large"
                      icon={<TeamOutlined />}
                      className="h-12 border-2 border-gray-200 hover:border-indigo-400"
                    >
                      Manage Candidates
                    </Button>
                    <Button 
                      block 
                      size="large"
                      icon={<FileTextOutlined />}
                      className="h-12 border-2 border-gray-200 hover:border-indigo-400"
                    >
                      View Reports
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card 
                  title="AI Insights" 
                  className="border-0 shadow-sm"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Paragraph className="text-blue-800 mb-2 font-medium">
                        💡 Trending Skills
                      </Paragraph>
                      <Paragraph className="text-blue-700 mb-0">
                        React and TypeScript are the most requested skills this month.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <Paragraph className="text-green-800 mb-2 font-medium">
                        📈 Performance Insight
                      </Paragraph>
                      <Paragraph className="text-green-700 mb-0">
                        Your interview completion rate increased by 15% this week.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;