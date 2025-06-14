import React, { useState, useEffect } from 'react';
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
  Badge,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message
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
  SearchOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { convocatoriaAPI, postulacionAPI } from '../services/api';
import { Convocatoria, Postulacion, Rol } from '../types/api';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CompanyDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'convocatorias',
      icon: <FileTextOutlined />,
      label: 'Job Postings',
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

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load company's convocatorias
      const convocatoriasResponse = await convocatoriaAPI.getByEmpresa(user.id);
      setConvocatorias(convocatoriasResponse.data);

      // Load all postulaciones for company's convocatorias
      const allPostulaciones: Postulacion[] = [];
      for (const convocatoria of convocatoriasResponse.data) {
        if (convocatoria.id) {
          const postulacionesResponse = await postulacionAPI.getByConvocatoria(convocatoria.id);
          allPostulaciones.push(...postulacionesResponse.data);
        }
      }
      setPostulaciones(allPostulaciones);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      message.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Active Job Postings',
      value: convocatorias.filter(c => c.activo).length,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: 'blue',
      change: `${convocatorias.length} total`,
      trend: 'up'
    },
    {
      title: 'Total Applications',
      value: postulaciones.length,
      icon: <TeamOutlined className="text-green-600" />,
      color: 'green',
      change: `${postulaciones.filter(p => p.estado === 'COMPLETADA').length} completed`,
      trend: 'up'
    },
    {
      title: 'Pending Review',
      value: postulaciones.filter(p => p.estado === 'PENDIENTE').length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'orange',
      change: 'Need attention',
      trend: 'neutral'
    },
    {
      title: 'In Progress',
      value: postulaciones.filter(p => p.estado === 'EN_PROCESO').length,
      icon: <ExclamationCircleOutlined className="text-purple-600" />,
      color: 'purple',
      change: 'Active interviews',
      trend: 'up'
    }
  ];

  const getStatusTag = (status: string) => {
    const statusConfig = {
      'ACTIVA': { color: 'success', text: 'Active' },
      'CERRADA': { color: 'default', text: 'Closed' },
      'PAUSADA': { color: 'warning', text: 'Paused' },
      'PENDIENTE': { color: 'warning', text: 'Pending' },
      'EN_PROCESO': { color: 'processing', text: 'In Progress' },
      'COMPLETADA': { color: 'success', text: 'Completed' },
      'RECHAZADA': { color: 'error', text: 'Rejected' }
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
        onClick: () => navigate(`/empresa/convocatoria/${record.id}`)
      },
      {
        key: 'candidates',
        label: 'View Candidates',
        icon: <TeamOutlined />,
        onClick: () => navigate(`/empresa/convocatoria/${record.id}/candidates`)
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

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'Profile',
        icon: <UserOutlined />
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: logout
      }
    ]
  };

  const convocatoriaColumns = [
    {
      title: 'Job Posting',
      dataIndex: 'titulo',
      key: 'titulo',
      render: (text: string, record: Convocatoria) => (
        <div>
          <div className="font-medium text-gray-800">{text}</div>
          <div className="text-sm text-gray-500">{record.puesto}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => getStatusTag(activo ? 'ACTIVA' : 'CERRADA'),
    },
    {
      title: 'Applications',
      key: 'applications',
      render: (_, record: Convocatoria) => {
        const count = postulaciones.filter(p => p.convocatoria?.id === record.id).length;
        return <span className="font-medium">{count}</span>;
      },
    },
    {
      title: 'End Date',
      dataIndex: 'fechaCierre',
      key: 'fechaCierre',
      render: (date: string) => (
        <span className="text-gray-600">{dayjs(date).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Convocatoria) => (
        <Dropdown menu={actionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleCreateConvocatoria = async (values: any) => {
    setCreateLoading(true);
    try {
      const convocatoriaData = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        puesto: values.puesto,
        activo: true,
        fechaPublicacion: values.fechas[0].format('YYYY-MM-DD'),
        fechaCierre: values.fechas[1].format('YYYY-MM-DD'),
        empresa: { id: user?.id }
      };

      await convocatoriaAPI.create(convocatoriaData);
      message.success('Job posting created successfully!');
      setCreateModalVisible(false);
      loadDashboardData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error creating job posting');
    } finally {
      setCreateLoading(false);
    }
  };

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
                <Title level={5} className="mb-2 text-indigo-800">Mirai</Title>
                <Paragraph className="text-indigo-600 text-sm mb-0">
                  Ready to help with interviews!
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
                  Company Dashboard
                </Title>
                <Paragraph className="text-gray-500 text-sm mb-0">
                  Welcome back, {user?.name}! Manage your job postings and candidates.
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
              <Badge count={postulaciones.filter(p => p.estado === 'PENDIENTE').length} size="small">
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
                onClick={() => setCreateModalVisible(true)}
              >
                New Job Posting
              </Button>
              <Dropdown menu={userMenu} trigger={['click']}>
                <Avatar 
                  src={user?.avatar} 
                  size="large"
                  className="cursor-pointer border-2 border-indigo-200"
                />
              </Dropdown>
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
                    Welcome back, {user?.name}! 👋
                  </Title>
                  <Paragraph className="text-gray-600 text-lg mb-4">
                    You have <strong>{postulaciones.filter(p => p.estado === 'PENDIENTE').length} pending applications</strong> to review and <strong>{postulaciones.filter(p => p.estado === 'EN_PROCESO').length} interviews</strong> in progress.
                  </Paragraph>
                  <Space>
                    <Button type="primary" className="btn-gradient">
                      Review Applications
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
                        <Tag color={stat.trend === 'up' ? 'success' : 'default'} className="border-0">
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

            {/* Job Postings Table */}
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">Your Job Postings</Title>
                  <Button type="link" className="text-indigo-600 font-medium">
                    View All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <Table
                columns={convocatoriaColumns}
                dataSource={convocatorias}
                loading={loading}
                pagination={false}
                className="custom-table"
                scroll={{ x: 800 }}
                rowKey="id"
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
                      onClick={() => setCreateModalVisible(true)}
                    >
                      Create New Job Posting
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

      {/* Create Job Posting Modal */}
      <Modal
        title="Create New Job Posting"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          onFinish={handleCreateConvocatoria}
          className="mt-6"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="titulo"
                label="Job Title"
                rules={[{ required: true, message: 'Please enter job title' }]}
              >
                <Input placeholder="e.g., Senior Frontend Developer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="puesto"
                label="Position"
                rules={[{ required: true, message: 'Please enter position' }]}
              >
                <Input placeholder="e.g., Frontend Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="descripcion"
            label="Job Description"
            rules={[{ required: true, message: 'Please enter job description' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </Form.Item>

          <Form.Item
            name="fechas"
            label="Application Period"
            rules={[{ required: true, message: 'Please select dates' }]}
          >
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="btn-gradient"
                loading={createLoading}
              >
                Create Job Posting
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CompanyDashboard;