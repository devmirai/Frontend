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
  Badge,
  Empty,
  Dropdown,
  message,
  Modal
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SendOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { convocatoriaAPI, postulacionAPI } from '../services/api';
import { Convocatoria, Postulacion, EstadoPostulacion } from '../types/api';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

const UserDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<Convocatoria[]>([]);
  const [myApplications, setMyApplications] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Convocatoria | null>(null);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'applications',
      icon: <FileTextOutlined />,
      label: 'My Applications',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
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
      
      // Load available jobs
      const jobsResponse = await convocatoriaAPI.getActivas();
      setAvailableJobs(jobsResponse.data);

      // Load user's applications
      const applicationsResponse = await postulacionAPI.getByUsuario(user.id);
      setMyApplications(applicationsResponse.data);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      message.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Applications Sent',
      value: myApplications.length,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: 'blue',
      change: '+3 this month',
      trend: 'up'
    },
    {
      title: 'Completed Interviews',
      value: myApplications.filter(a => a.estado === EstadoPostulacion.COMPLETADA).length,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'green',
      change: `${Math.round((myApplications.filter(a => a.estado === EstadoPostulacion.COMPLETADA).length / Math.max(myApplications.length, 1)) * 100)}% completion rate`,
      trend: 'up'
    },
    {
      title: 'In Progress',
      value: myApplications.filter(a => a.estado === EstadoPostulacion.EN_PROCESO).length,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'orange',
      change: 'Active interviews',
      trend: 'up'
    },
    {
      title: 'Available Jobs',
      value: availableJobs.length,
      icon: <StarOutlined className="text-purple-600" />,
      color: 'purple',
      change: 'New opportunities',
      trend: 'up'
    }
  ];

  const getStatusTag = (status: EstadoPostulacion) => {
    const statusConfig = {
      [EstadoPostulacion.PENDIENTE]: { color: 'warning', text: 'Pending' },
      [EstadoPostulacion.EN_PROCESO]: { color: 'processing', text: 'In Progress' },
      [EstadoPostulacion.COMPLETADA]: { color: 'success', text: 'Completed' },
      [EstadoPostulacion.RECHAZADA]: { color: 'error', text: 'Rejected' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

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

  const applicationColumns = [
    {
      title: 'Job',
      key: 'job',
      render: (_, record: Postulacion) => (
        <div>
          <div className="font-medium text-gray-800">{record.convocatoria?.titulo}</div>
          <div className="text-sm text-gray-500">{record.convocatoria?.puesto}</div>
          <div className="text-sm text-gray-500">{record.convocatoria?.empresa?.nombre}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'estado',
      key: 'estado',
      render: (status: EstadoPostulacion) => getStatusTag(status),
    },
    {
      title: 'Applied Date',
      dataIndex: 'fechaPostulacion',
      key: 'fechaPostulacion',
      render: (date: string) => (
        <span className="text-gray-600">{dayjs(date).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Postulacion) => (
        <Space>
          {record.estado === EstadoPostulacion.PENDIENTE && (
            <Button 
              type="primary" 
              size="small" 
              icon={<PlayCircleOutlined />}
              className="btn-gradient"
              onClick={() => navigate(`/usuario/interview/${record.id}`)}
            >
              Start Interview
            </Button>
          )}
          {record.estado === EstadoPostulacion.EN_PROCESO && (
            <Button 
              type="primary" 
              size="small" 
              icon={<PlayCircleOutlined />}
              className="btn-gradient"
              onClick={() => navigate(`/usuario/interview/${record.id}`)}
            >
              Continue
            </Button>
          )}
          {record.estado === EstadoPostulacion.COMPLETADA && (
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/usuario/interview/${record.id}/results`)}
            >
              View Results
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleApplyToJob = async () => {
    if (!selectedJob || !user?.id) return;

    setApplying(true);
    try {
      await postulacionAPI.create({
        fechaPostulacion: new Date().toISOString(),
        estado: EstadoPostulacion.PENDIENTE,
        usuario: { id: user.id },
        convocatoria: { id: selectedJob.id }
      });

      message.success('Application submitted successfully!');
      setApplyModalVisible(false);
      setSelectedJob(null);
      loadDashboardData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  const openApplyModal = (job: Convocatoria) => {
    // Check if user already applied
    const alreadyApplied = myApplications.some(app => app.convocatoria?.id === job.id);
    if (alreadyApplied) {
      message.warning('You have already applied to this job');
      return;
    }
    
    setSelectedJob(job);
    setApplyModalVisible(true);
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
                  Ready to help you succeed!
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
                  My Dashboard
                </Title>
                <Paragraph className="text-gray-500 text-sm mb-0">
                  Welcome back, {user?.name}! Track your applications and interviews.
                </Paragraph>
              </div>
            </div>
            
            <Space size="large">
              <Button 
                icon={<SearchOutlined />}
                className="border-gray-300 hover:border-indigo-400"
              >
                Search Jobs
              </Button>
              <Badge count={myApplications.filter(a => a.estado === EstadoPostulacion.EN_PROCESO).length} size="small">
                <Button 
                  icon={<BellOutlined />}
                  className="border-gray-300 hover:border-indigo-400"
                />
              </Badge>
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
                    Hello, {user?.name}! 👋
                  </Title>
                  <Paragraph className="text-gray-600 text-lg mb-4">
                    You have <strong>{myApplications.filter(a => a.estado === EstadoPostulacion.EN_PROCESO).length} interviews</strong> in progress and <strong>{availableJobs.length} new job opportunities</strong> available.
                  </Paragraph>
                  <Space>
                    <Button type="primary" className="btn-gradient">
                      Continue Interview
                    </Button>
                    <Button>Browse Jobs</Button>
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

            {/* My Applications Table */}
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">My Applications</Title>
                  <Button type="link" className="text-indigo-600 font-medium">
                    View All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <Table
                columns={applicationColumns}
                dataSource={myApplications}
                loading={loading}
                pagination={false}
                className="custom-table"
                scroll={{ x: 800 }}
                rowKey="id"
              />
            </Card>

            {/* Available Jobs */}
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">Available Job Opportunities</Title>
                  <Button type="link" className="text-indigo-600 font-medium">
                    Browse All
                  </Button>
                </div>
              }
              className="border-0 shadow-sm"
            >
              {availableJobs.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {availableJobs.slice(0, 4).map((job) => {
                    const alreadyApplied = myApplications.some(app => app.convocatoria?.id === job.id);
                    return (
                      <Col xs={24} lg={12} key={job.id}>
                        <Card className="hover-card border border-gray-200">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <Title level={5} className="mb-1">{job.titulo}</Title>
                                <Paragraph className="text-gray-600 mb-2">{job.empresa?.nombre}</Paragraph>
                                <Tag color="blue">{job.puesto}</Tag>
                              </div>
                            </div>
                            
                            <Paragraph className="text-sm text-gray-600 mb-3">
                              {job.descripcion.length > 150 
                                ? `${job.descripcion.substring(0, 150)}...` 
                                : job.descripcion}
                            </Paragraph>
                            
                            <div className="flex justify-between items-center">
                              <Space>
                                <ClockCircleOutlined className="text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Ends {dayjs(job.fechaCierre).format('MMM DD')}
                                </span>
                              </Space>
                              <Button 
                                type="primary" 
                                size="small"
                                className="btn-gradient"
                                icon={<SendOutlined />}
                                disabled={alreadyApplied}
                                onClick={() => openApplyModal(job)}
                              >
                                {alreadyApplied ? 'Applied' : 'Apply Now'}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Empty 
                  description="No job opportunities available at the moment"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>

            {/* Performance Insights */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title="Performance Insights" 
                  className="border-0 shadow-sm"
                  extra={<TrophyOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <Paragraph className="text-green-800 mb-2 font-medium">
                        🎯 Strong Areas
                      </Paragraph>
                      <Paragraph className="text-green-700 mb-0">
                        Technical skills and problem-solving approach show consistent improvement.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Paragraph className="text-blue-800 mb-2 font-medium">
                        📈 Improvement Areas
                      </Paragraph>
                      <Paragraph className="text-blue-700 mb-0">
                        Focus on communication clarity and providing more detailed examples.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card 
                  title="AI Recommendations" 
                  className="border-0 shadow-sm"
                  extra={<RobotOutlined className="text-indigo-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Paragraph className="text-purple-800 mb-2 font-medium">
                        💡 Skill Focus
                      </Paragraph>
                      <Paragraph className="text-purple-700 mb-0">
                        Based on your applications, consider strengthening your React and Node.js skills.
                      </Paragraph>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Paragraph className="text-orange-800 mb-2 font-medium">
                        🚀 Next Steps
                      </Paragraph>
                      <Paragraph className="text-orange-700 mb-0">
                        Apply to more senior positions to challenge yourself and grow your career.
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>

      {/* Apply to Job Modal */}
      <Modal
        title="Apply to Job"
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setApplyModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="apply" 
            type="primary" 
            className="btn-gradient"
            loading={applying}
            onClick={handleApplyToJob}
          >
            Submit Application
          </Button>
        ]}
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <Title level={4}>{selectedJob.titulo}</Title>
              <Paragraph className="text-gray-600">{selectedJob.empresa?.nombre}</Paragraph>
            </div>
            
            <div>
              <Title level={5}>Job Description:</Title>
              <Paragraph>{selectedJob.descripcion}</Paragraph>
            </div>
            
            <div>
              <Title level={5}>Position:</Title>
              <Paragraph>{selectedJob.puesto}</Paragraph>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Paragraph className="text-blue-800 mb-0">
                <strong>Note:</strong> After submitting your application, you'll be able to start the AI-powered interview process.
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default UserDashboard;