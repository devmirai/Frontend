import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, message, Row, Col, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, RobotOutlined, GoogleOutlined, ArrowLeftOutlined, MailOutlined, TeamOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const onLogin = async (values: any) => {
    setLoading(true);
    const success = await login(values);
    setLoading(false);
    
    if (success) {
      navigate(from === '/' ? '/dashboard' : from, { replace: true });
    }
  };

  const onRegister = async (values: any) => {
    setLoading(true);
    const success = await register(values);
    setLoading(false);
    
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Sign In',
      children: (
        <Form
          name="login"
          onFinish={onLogin}
          layout="vertical"
          size="large"
          className="space-y-2"
        >
          <Form.Item
            name="email"
            label={<span className="text-gray-700 font-medium">Email</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">Password</span>}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item className="mb-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 btn-gradient text-lg font-medium rounded-lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'register',
      label: 'Sign Up',
      children: (
        <Form
          name="register"
          onFinish={onRegister}
          layout="vertical"
          size="large"
          className="space-y-2"
        >
          <Form.Item
            name="role"
            label={<span className="text-gray-700 font-medium">Account Type</span>}
            rules={[{ required: true, message: 'Please select account type!' }]}
          >
            <Select
              placeholder="Select account type"
              className="h-12"
            >
              <Option value="USUARIO">
                <Space>
                  <UserOutlined />
                  Job Seeker
                </Space>
              </Option>
              <Option value="EMPRESA">
                <Space>
                  <TeamOutlined />
                  Company/Recruiter
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-gray-700 font-medium">Email</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">Password</span>}
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="text-gray-700 font-medium">Confirm Password</span>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm your password"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role');
              
              if (role === 'USUARIO') {
                return (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="nombre"
                          label={<span className="text-gray-700 font-medium">First Name</span>}
                          rules={[{ required: true, message: 'Please enter your first name!' }]}
                        >
                          <Input 
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="First name"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="apellidoPaterno"
                          label={<span className="text-gray-700 font-medium">Last Name</span>}
                          rules={[{ required: true, message: 'Please enter your last name!' }]}
                        >
                          <Input 
                            placeholder="Last name"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="apellidoMaterno"
                          label={<span className="text-gray-700 font-medium">Mother's Last Name</span>}
                        >
                          <Input 
                            placeholder="Mother's last name"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="telefono"
                          label={<span className="text-gray-700 font-medium">Phone</span>}
                          rules={[{ required: true, message: 'Please enter your phone!' }]}
                        >
                          <Input 
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            type="number"
                            placeholder="Phone number"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="nacimiento"
                      label={<span className="text-gray-700 font-medium">Date of Birth</span>}
                      rules={[{ required: true, message: 'Please enter your date of birth!' }]}
                    >
                      <Input 
                        prefix={<CalendarOutlined className="text-gray-400" />}
                        type="date"
                        className="rounded-lg h-12"
                      />
                    </Form.Item>
                  </>
                );
              } else if (role === 'EMPRESA') {
                return (
                  <>
                    <Form.Item
                      name="nombre"
                      label={<span className="text-gray-700 font-medium">Company Name</span>}
                      rules={[{ required: true, message: 'Please enter company name!' }]}
                    >
                      <Input 
                        prefix={<TeamOutlined className="text-gray-400" />}
                        placeholder="Company name"
                        className="rounded-lg h-12"
                      />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="telefono"
                          label={<span className="text-gray-700 font-medium">Phone</span>}
                          rules={[{ required: true, message: 'Please enter phone!' }]}
                        >
                          <Input 
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            placeholder="Phone number"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="direccion"
                          label={<span className="text-gray-700 font-medium">Address</span>}
                          rules={[{ required: true, message: 'Please enter address!' }]}
                        >
                          <Input 
                            prefix={<HomeOutlined className="text-gray-400" />}
                            placeholder="Company address"
                            className="rounded-lg h-12"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="descripcion"
                      label={<span className="text-gray-700 font-medium">Company Description</span>}
                      rules={[{ required: true, message: 'Please enter company description!' }]}
                    >
                      <Input.TextArea 
                        rows={3}
                        placeholder="Brief description of your company..."
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item className="mb-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 btn-gradient text-lg font-medium rounded-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <Layout className="main-layout">
      <Content className="min-h-screen flex items-center justify-center content-spacing">
        <div className="w-full max-w-7xl">
          <Row gutter={[64, 64]} align="middle" className="min-h-screen">
            {/* Left Side - Branding */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left space-y-8"
              >
                {/* Logo */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-12">
                  <div className="logo-icon text-2xl">
                    <RobotOutlined />
                  </div>
                  <Title level={1} className="logo-text mb-0">
                    MiraiBot
                  </Title>
                </div>
                
                {/* Heading */}
                <div className="space-y-6">
                  <Title level={2} className="text-4xl lg:text-5xl font-bold leading-tight">
                    {activeTab === 'login' ? 'Welcome Back to the Future of' : 'Join the Future of'}{' '}
                    <span className="gradient-text">AI Interviews</span>
                  </Title>
                  
                  <Paragraph className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    {activeTab === 'login' 
                      ? 'Sign in to access your AI-powered interview platform and continue transforming your recruitment process.'
                      : 'Create your account and start experiencing intelligent interviews powered by AI technology.'
                    }
                  </Paragraph>
                </div>

                {/* Mirabot Illustration */}
                <div className="hidden lg:block mt-12">
                  <div className="relative max-w-md">
                    <img 
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                      alt="AI Assistant"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                    <div className="absolute -bottom-4 left-8 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-indigo-100">
                      <div className="flex items-center space-x-2">
                        <RobotOutlined className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                          MiraiBot: Ready to assist!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>

            {/* Right Side - Auth Form */}
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-md">
                  {/* Back Button */}
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-600 hover:text-indigo-600"
                  >
                    Back to Home
                  </Button>

                  <Card className="form-card">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <Title level={3} className="mb-3 text-gray-800">
                        {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
                      </Title>
                      <Paragraph className="text-gray-600 text-base">
                        {activeTab === 'login' 
                          ? 'Enter your credentials to access the platform'
                          : 'Join thousands of users already using MiraiBot'
                        }
                      </Paragraph>
                    </div>

                    {/* Auth Tabs */}
                    <Tabs
                      activeKey={activeTab}
                      onChange={setActiveTab}
                      items={tabItems}
                      centered
                      className="mb-6"
                    />

                    {/* Forgot Password */}
                    {activeTab === 'login' && (
                      <div className="text-center mb-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                          Forgot your password?
                        </a>
                      </div>
                    )}

                    {/* Divider */}
                    <Divider>
                      <span className="text-gray-400">or continue with</span>
                    </Divider>

                    {/* Social Login */}
                    <Space direction="vertical" className="w-full">
                      <Button
                        icon={<GoogleOutlined />}
                        className="w-full h-12 border-2 border-gray-200 hover:border-indigo-300 rounded-lg font-medium"
                        size="large"
                      >
                        Continue with Google
                      </Button>
                    </Space>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <Paragraph className="text-center text-indigo-800 mb-2 font-medium">
                        Demo Credentials
                      </Paragraph>
                      <div className="space-y-1">
                        <Paragraph className="text-center text-indigo-700 mb-0 text-sm">
                          <strong>Company:</strong> empresa@demo.com / 123456
                        </Paragraph>
                        <Paragraph className="text-center text-indigo-700 mb-0 text-sm">
                          <strong>User:</strong> usuario@demo.com / 123456
                        </Paragraph>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;