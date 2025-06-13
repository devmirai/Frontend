import React from 'react';
import { Layout, Button, Typography, Row, Col, Card, Space, Statistic } from 'antd';
import { 
  RobotOutlined, 
  BulbOutlined, 
  ClockCircleOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RobotOutlined className="text-5xl text-indigo-600" />,
      title: 'AI-Powered Questions',
      description: 'Generate personalized technical and behavioral questions tailored to each role and candidate profile with advanced machine learning.'
    },
    {
      icon: <BulbOutlined className="text-5xl text-emerald-600" />,
      title: 'Smart Evaluation',
      description: 'Advanced AI analyzes responses in real-time and provides detailed feedback on candidate performance, skills, and potential fit.'
    },
    {
      icon: <ClockCircleOutlined className="text-5xl text-blue-600" />,
      title: 'Asynchronous Interviews',
      description: 'Conduct interviews on your schedule. Candidates can complete assessments at their convenience, saving time for everyone.'
    },
    {
      icon: <TeamOutlined className="text-5xl text-purple-600" />,
      title: 'Recruiter Dashboard',
      description: 'Comprehensive analytics and insights dashboard to make informed hiring decisions quickly and efficiently.'
    }
  ];

  const stats = [
    { title: 'Interviews Conducted', value: 12500, suffix: '+', icon: <CheckCircleOutlined /> },
    { title: 'Companies Trust Us', value: 250, suffix: '+', icon: <StarOutlined /> },
    { title: 'Time Saved', value: 85, suffix: '%', icon: <ClockCircleOutlined /> },
    { title: 'Accuracy Rate', value: 94, suffix: '%', icon: <TrophyOutlined /> }
  ];

  return (
    <Layout className="main-layout">
      {/* Header */}
      <Header className="header-layout">
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
          <div className="logo-container">
            <div className="logo-icon">
              <RobotOutlined />
            </div>
            <span className="logo-text">Mirai</span>
          </div>
          <Space size="large">
            <Button type="text" size="large" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="btn-gradient"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </Space>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <Title className="hero-title">
                    The Future of{' '}
                    <span className="gradient-text">AI Interviews</span>
                  </Title>
                  <Paragraph className="text-xl text-gray-600 leading-relaxed">
                    Mirai revolutionizes hiring with AI-powered interview assistance. 
                    Generate personalized questions, evaluate candidates intelligently, 
                    and make better hiring decisions faster than ever before.
                  </Paragraph>
                  <Space size="large" className="flex flex-wrap">
                    <Button 
                      type="primary" 
                      size="large" 
                      className="btn-gradient h-14 px-8 text-lg"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate('/login')}
                    >
                      Start Free Trial
                    </Button>
                    <Button 
                      size="large" 
                      className="h-14 px-8 text-lg border-2 border-indigo-200 hover:border-indigo-400"
                    >
                      Watch Demo
                    </Button>
                  </Space>
                </motion.div>
              </Col>
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mirabot-container">
                    <img 
                      src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop"
                      alt="AI Interview Assistant"
                      className="hero-image"
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-indigo-100">
                      <div className="flex items-center space-x-2">
                        <RobotOutlined className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Mirabot <span className="loading-dots">Processing</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-spacing">
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="stats-card text-center">
                      <div className="text-3xl text-indigo-600 mb-3">
                        {stat.icon}
                      </div>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{ 
                          color: '#6366f1', 
                          fontSize: '2.5rem', 
                          fontWeight: 'bold',
                          lineHeight: 1.2
                        }}
                        className="mb-0"
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-gray-50">
          <div className="max-w-7xl mx-auto container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title className="section-title">
                Why Choose <span className="gradient-text">Mirai</span>?
              </Title>
              <Paragraph className="section-subtitle">
                Our AI-powered platform streamlines the entire interview process, 
                from intelligent question generation to comprehensive candidate evaluation.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="feature-card">
                      <div className="mb-6">
                        {feature.icon}
                      </div>
                      <Title level={4} className="mb-4 text-gray-800">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 text-base leading-relaxed">
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title className="section-title">
                How <span className="gradient-text">Mirai</span> Works
              </Title>
              <Paragraph className="section-subtitle">
                Simple, powerful, and intelligent - transform your hiring process in three easy steps.
              </Paragraph>
            </motion.div>

            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center lg:text-left"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <Title level={3} className="mb-4">Create Interview</Title>
                  <Paragraph className="text-lg text-gray-600">
                    Set up your interview parameters, job requirements, and let Mirabot generate 
                    personalized questions tailored to your specific role.
                  </Paragraph>
                </motion.div>
              </Col>
              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <Title level={3} className="mb-4">Candidate Assessment</Title>
                  <Paragraph className="text-lg text-gray-600">
                    Candidates complete the AI-powered interview at their convenience. 
                    Real-time evaluation provides instant feedback and scoring.
                  </Paragraph>
                </motion.div>
              </Col>
              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center lg:text-right"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <Title level={3} className="mb-4">Smart Insights</Title>
                  <Paragraph className="text-lg text-gray-600">
                    Review comprehensive analytics, AI-generated insights, and make 
                    data-driven hiring decisions with confidence.
                  </Paragraph>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <ThunderboltOutlined className="text-6xl text-white mb-6" />
              </div>
              <Title level={2} className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Hiring Process?
              </Title>
              <Paragraph className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Join hundreds of companies already using Mirai to find the best talent faster. 
                Start your free trial today and experience the future of AI-powered interviews.
              </Paragraph>
              <Space size="large" className="flex flex-wrap justify-center">
                <Button 
                  type="primary" 
                  size="large" 
                  className="h-14 px-10 text-lg bg-white text-indigo-600 border-white hover:bg-gray-50 font-semibold"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate('/login')}
                >
                  Start Your Free Trial
                </Button>
                <Button 
                  size="large" 
                  className="h-14 px-10 text-lg text-white border-2 border-white hover:bg-white hover:text-indigo-600 font-semibold"
                  ghost
                >
                  Contact Sales
                </Button>
              </Space>
            </motion.div>
          </div>
        </section>
      </Content>

      {/* Footer */}
      <Footer className="footer-section">
        <div className="footer-content">
          <Row gutter={[48, 32]}>
            <Col xs={24} md={8}>
              <div className="footer-logo">
                <div className="logo-icon">
                  <RobotOutlined />
                </div>
                <span className="text-xl font-bold text-white">Mirai</span>
              </div>
              <Paragraph className="text-gray-400 text-base leading-relaxed">
                AI-powered interview platform helping companies make better hiring decisions 
                through intelligent automation and data-driven insights.
              </Paragraph>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[32, 32]}>
                <Col xs={12} md={8}>
                  <Title level={5} className="text-white mb-6">Product</Title>
                  <ul className="footer-links">
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">API Documentation</a></li>
                    <li><a href="#">Integrations</a></li>
                  </ul>
                </Col>
                <Col xs={12} md={8}>
                  <Title level={5} className="text-white mb-6">Company</Title>
                  <ul className="footer-links">
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                  </ul>
                </Col>
                <Col xs={12} md={8}>
                  <Title level={5} className="text-white mb-6">Support</Title>
                  <ul className="footer-links">
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Contact Support</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <Paragraph className="text-gray-400 mb-0 text-base">
              © 2024 Mirai AI Interview Platform. All rights reserved.
            </Paragraph>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Landing;