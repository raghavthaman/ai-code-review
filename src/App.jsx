import React, { useState } from 'react';
import { Code, Brain, Zap, CheckCircle, AlertCircle, TrendingUp, BookOpen, GitBranch } from 'lucide-react';

export default function CodeReviewPlatform() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are an expert code reviewer. Analyze this ${language} code and respond ONLY with a JSON object (no markdown, no backticks) with this exact structure:
{
  "quality_score": <number 0-100>,
  "issues": [
    {"severity": "high|medium|low", "issue": "description", "line": "affected area"}
  ],
  "suggestions": ["suggestion1", "suggestion2"],
  "complexity": "low|medium|high",
  "best_practices": ["practice1", "practice2"],
  "security_concerns": ["concern1"] or []
}

Code to analyze:
${code}`
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content.find(item => item.type === 'text')?.text || '';
      
      // Clean and parse JSON
      const cleanJson = textContent.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Code Review Platform
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Intelligent code analysis powered by Claude AI
          </p>
          <div className="flex gap-4 justify-center mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              Multi-language Support
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Real-time Analysis
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              Best Practices
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Code Input
              </h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
              </select>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Enter your ${language} code here...\n\nExample:\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)`}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <button
              onClick={analyzeCode}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze Code
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Analysis Results
            </h2>
            
            {!analysis ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <BookOpen className="w-16 h-16 mb-4" />
                <p className="text-center">
                  Enter your code and click "Analyze Code" to get<br />
                  intelligent feedback and suggestions
                </p>
              </div>
            ) : (
              <div className="space-y-6 overflow-y-auto h-96">
                {/* Quality Score */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Code Quality Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(analysis.quality_score)}`}>
                      {analysis.quality_score}/100
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${analysis.quality_score}%` }}
                    />
                  </div>
                </div>

                {/* Complexity */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Complexity:</span>
                  <span className={`px-3 py-1 rounded-full ${
                    analysis.complexity === 'high' ? 'bg-red-100 text-red-700' :
                    analysis.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {analysis.complexity.toUpperCase()}
                  </span>
                </div>

                {/* Issues */}
                {analysis.issues && analysis.issues.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      Issues Found ({analysis.issues.length})
                    </h3>
                    <div className="space-y-2">
                      {analysis.issues.map((issue, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold uppercase">{issue.severity}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{issue.issue}</p>
                              {issue.line && (
                                <p className="text-xs mt-1 opacity-75">Location: {issue.line}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Best Practices */}
                {analysis.best_practices && analysis.best_practices.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Best Practices
                    </h3>
                    <ul className="space-y-2">
                      {analysis.best_practices.map((practice, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 mt-1">✓</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Security Concerns */}
                {analysis.security_concerns && analysis.security_concerns.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Security Concerns
                    </h3>
                    <ul className="space-y-2">
                      {analysis.security_concerns.map((concern, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                          <span className="text-red-600 mt-1">⚠</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">AI-Powered Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              Leverages Claude AI for intelligent code review and contextual suggestions
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Multi-Language Support</h3>
            </div>
            <p className="text-sm text-gray-600">
              Supports Python, JavaScript, Java, C++, and Go with language-specific insights
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Best Practices</h3>
            </div>
            <p className="text-sm text-gray-600">
              Identifies code smells, security issues, and suggests industry best practices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
