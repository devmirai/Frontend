import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Progress, 
  Space,
  Tag,
  Avatar,
  Divider,
  message,
  Row,
  Col,
  Spin
} from 'antd';
import {
  RobotOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  BulbOutlined,
  StarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { preguntaAPI, respuestaAPI, postulacionAPI, evaluacionAPI } from '../services/api';
import { Pregunta, Postulacion, Evaluacion, EstadoPostulacion } from '../types/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Interview: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Pregunta[]>([]);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    loadInterviewData();
  }, [id]);

  useEffect(() => {
    if (!showResults && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            message.warning('Time is up! Submitting your interview...');
            handleSubmitInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResults, questions.length]);

  const loadInterviewData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Load postulacion details
      const postulacionResponse = await postulacionAPI.getById(parseInt(id));
      const postulacionData = postulacionResponse.data;
      setPostulacion(postulacionData);

      // Check if interview is completed and we should show results
      if (window.location.pathname.includes('/results') || postulacionData.estado === EstadoPostulacion.COMPLETADA) {
        await loadResults(parseInt(id));
        setShowResults(true);
        return;
      }

      // Generate questions if not already generated
      if (postulacionData.estado === EstadoPostulacion.PENDIENTE) {
        await generateQuestions(postulacionData);
      } else {
        // Load existing questions
        const questionsResponse = await preguntaAPI.getByPostulacion(parseInt(id));
        setQuestions(questionsResponse.data);
      }

    } catch (error: any) {
      console.error('Error loading interview data:', error);
      message.error('Error loading interview data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async (postulacionData: Postulacion) => {
    try {
      const questionData = {
        puesto: postulacionData.convocatoria?.puesto || 'Developer',
        dificultad: 5,
        idConvocatoria: postulacionData.convocatoria?.id || 0,
        idPostulacion: postulacionData.id || 0
      };

      const response = await preguntaAPI.generar(questionData);
      setQuestions(response.data);
      
    } catch (error: any) {
      console.error('Error generating questions:', error);
      message.error('Error generating interview questions');
    }
  };

  const loadResults = async (postulacionId: number) => {
    try {
      const evaluationResponse = await evaluacionAPI.getByPostulacion(postulacionId);
      setEvaluations(evaluationResponse.data);
      
    } catch (error: any) {
      console.error('Error loading results:', error);
      message.error('Error loading interview results');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    if (!answer.trim()) {
      message.warning('Please provide an answer before proceeding.');
      return;
    }

    if (!questions[currentQuestion] || !postulacion?.id) {
      message.error('Interview data not available');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit and evaluate the answer
      await respuestaAPI.evaluar({
        preguntaId: questions[currentQuestion].id!,
        answer: answer.trim(),
        postulacionId: postulacion.id
      });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswer('');
        message.success('Answer submitted successfully! Moving to next question...');
      } else {
        await handleSubmitInterview();
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      message.error('Error submitting answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitInterview = async () => {
    message.success('Interview completed successfully! Generating your results...');
    setTimeout(() => {
      navigate(`/usuario/interview/${id}/results`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (showResults) {
    // Prepare chart data
    const radarData = evaluations.map((evaluation, index) => ({
      subject: `Q${index + 1}`,
      clarity: evaluation.claridadEstructura,
      technical: evaluation.dominioTecnico,
      relevance: evaluation.pertinencia,
      fullMark: 10
    }));

    const lineData = evaluations.map((evaluation, index) => ({
      question: `Q${index + 1}`,
      score: evaluation.porcentajeObtenido
    }));

    return (
      <Layout className="main-layout">
        <Header className="header-layout">
          <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
            <div className="flex items-center space-x-6">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/usuario/dashboard')}
                className="hover:bg-gray-100"
              >
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="logo-icon text-lg">
                  <RobotOutlined />
                </div>
                <span className="font-semibold text-gray-800">Interview Results</span>
              </div>
            </div>
            
            <Avatar 
              src={user?.avatar} 
              size="large"
              className="border-2 border-indigo-200"
            />
          </div>
        </Header>

        <Content className="content-layout">
          <div className="interview-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-sm mb-8">
                <div className="text-center mb-8">
                  <CheckCircleOutlined className="text-6xl text-green-600 mb-4" />
                  <Title level={2} className="mb-4">Interview Completed!</Title>
                  <Paragraph className="text-lg text-gray-600">
                    Congratulations! You have successfully completed the AI interview for{' '}
                    <strong>{postulacion?.convocatoria?.titulo}</strong> at{' '}
                    <strong>{postulacion?.convocatoria?.empresa?.nombre}</strong>.
                  </Paragraph>
                </div>

                {evaluations.length > 0 && (
                  <>
                    {/* Performance Charts */}
                    <Row gutter={[24, 24]} className="mb-8">
                      <Col xs={24} lg={12}>
                        <Card title="Performance Overview" className="h-full">
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="question" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card title="Skills Assessment" className="h-full">
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis domain={[0, 10]} />
                              <Radar name="Clarity" dataKey="clarity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Radar name="Technical" dataKey="technical" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                              <Radar name="Relevance" dataKey="relevance" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                    </Row>

                    {/* Detailed Results */}
                    <Row gutter={[24, 24]}>
                      {evaluations.map((evaluation, index) => (
                        <Col xs={24} lg={12} key={index}>
                          <Card className="h-full">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Title level={4}>Question {index + 1} Results</Title>
                                <Tag color={evaluation.porcentajeObtenido >= 80 ? 'success' : 
                                           evaluation.porcentajeObtenido >= 60 ? 'warning' : 'error'}>
                                  {evaluation.porcentajeObtenido}%
                                </Tag>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <Paragraph className="text-sm font-medium text-gray-600 mb-1">
                                    Clarity & Structure
                                  </Paragraph>
                                  <Progress 
                                    percent={evaluation.claridadEstructura * 10} 
                                    strokeColor="#52c41a"
                                    size="small"
                                  />
                                </div>
                                
                                <div>
                                  <Paragraph className="text-sm font-medium text-gray-600 mb-1">
                                    Technical Knowledge
                                  </Paragraph>
                                  <Progress 
                                    percent={evaluation.dominioTecnico * 10} 
                                    strokeColor="#1890ff"
                                    size="small"
                                  />
                                </div>
                                
                                <div>
                                  <Paragraph className="text-sm font-medium text-gray-600 mb-1">
                                    Relevance
                                  </Paragraph>
                                  <Progress 
                                    percent={evaluation.pertinencia * 10} 
                                    strokeColor="#722ed1"
                                    size="small"
                                  />
                                </div>
                              </div>
                              
                              {evaluation.feedback && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <Paragraph className="text-blue-800 text-sm mb-0">
                                    <strong>AI Feedback:</strong> {evaluation.feedback}
                                  </Paragraph>
                                </div>
                              )}
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}

                <div className="text-center mt-8">
                  <Space size="large">
                    <Button 
                      type="primary" 
                      size="large"
                      className="btn-gradient"
                      onClick={() => navigate('/usuario/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                    <Button size="large">
                      Download Report
                    </Button>
                  </Space>
                </div>
              </Card>
            </motion.div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <RobotOutlined className="text-6xl text-indigo-600 mb-4" />
          <Title level={3}>Generating Interview Questions...</Title>
          <Paragraph>Mirai is preparing personalized questions for you.</Paragraph>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout className="main-layout">
      {/* Header */}
      <Header className="header-layout">
        <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/usuario/dashboard')}
              className="hover:bg-gray-100"
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="logo-icon text-lg">
                <RobotOutlined />
              </div>
              <span className="font-semibold text-gray-800">AI Interview Assessment</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
              <ClockCircleOutlined className="text-orange-600" />
              <span className="font-mono text-lg font-semibold text-orange-700">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Avatar 
              src={user?.avatar} 
              size="large"
              className="border-2 border-indigo-200"
            />
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content className="content-layout">
        <div className="interview-container">
          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="progress-container">
              <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                  <Title level={4} className="mb-0 text-gray-800">
                    Question {currentQuestion + 1} of {questions.length}
                  </Title>
                  <Paragraph className="text-gray-600 mb-0">
                    {postulacion?.convocatoria?.titulo} - {postulacion?.convocatoria?.empresa?.nombre}
                  </Paragraph>
                </Col>
                <Col>
                  <Space size="middle">
                    <Tag color="blue" className="px-3 py-1">
                      {currentQ?.tipo || 'Technical'}
                    </Tag>
                    <Tag color="orange" className="px-3 py-1">
                      Difficulty: {currentQ?.dificultad || 5}/10
                    </Tag>
                  </Space>
                </Col>
              </Row>
              <Progress 
                percent={progress} 
                strokeColor={{
                  '0%': '#6366f1',
                  '100%': '#8b5cf6',
                }}
                strokeWidth={8}
                className="mb-0"
              />
            </Card>
          </motion.div>

          {/* Question Section */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="question-card">
              {/* AI Assistant Header */}
              <div className="flex items-start space-x-4 mb-8">
                <div className="mirabot-avatar flex-shrink-0">
                  <RobotOutlined className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <div className="ai-message">
                    <Title level={5} className="mb-3 text-indigo-800">
                      Mirai asks:
                    </Title>
                    <Paragraph className="text-lg mb-0 text-gray-800 leading-relaxed">
                      {currentQ?.texto}
                    </Paragraph>
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                    <RobotOutlined className="text-indigo-500" />
                    <span>Mirai is analyzing your response in real-time...</span>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Answer Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Title level={5} className="mb-0 text-gray-800">Your Answer:</Title>
                  <div className="text-sm text-gray-500">
                    {answer.length} characters
                  </div>
                </div>
                
                <TextArea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your detailed answer here... Be specific and provide examples where possible."
                  rows={10}
                  className="text-base"
                  style={{ resize: 'none' }}
                />
                
                {/* Hint Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BulbOutlined className="text-blue-600" />
                    <span className="font-medium text-blue-800">Tip:</span>
                  </div>
                  <Paragraph className="text-blue-700 mb-0">
                    Provide specific examples, explain your reasoning, and structure your answer clearly. 
                    The AI evaluates technical accuracy, clarity, and relevance.
                  </Paragraph>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={isSubmitting ? <LoadingOutlined /> : 
                          currentQuestion === questions.length - 1 ? <CheckCircleOutlined /> : <SendOutlined />}
                    onClick={handleNextQuestion}
                    loading={isSubmitting}
                    className="btn-gradient px-8 h-12 text-lg font-medium"
                    disabled={!answer.trim()}
                  >
                    {isSubmitting ? 'Analyzing Answer...' : 
                     currentQuestion === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <RobotOutlined className="text-indigo-600 text-xl" />
                    <Title level={5} className="mb-0 text-indigo-800">
                      Mirai Tips
                    </Title>
                  </div>
                  <Paragraph className="text-indigo-700 mb-0">
                    💡 Be specific and provide concrete examples when possible. 
                    The AI evaluates clarity, technical accuracy, and problem-solving approach.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <StarOutlined className="text-green-600 text-xl" />
                    <Title level={5} className="mb-0 text-green-800">
                      Best Practices
                    </Title>
                  </div>
                  <Paragraph className="text-green-700 mb-0">
                    ⭐ Structure your answers clearly, explain your reasoning, 
                    and don't hesitate to mention alternative approaches.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default Interview;