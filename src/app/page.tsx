import { CheckCircle, Globe, Zap, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto py-12 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          NeuraSnap
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Transform any webpage into an instant FAQ and searchable knowledge base.
          Your personal web knowledge vault powered by AI.
        </p>

        {/* Status Indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Next.js Ready', 'TypeScript Configured', 'Tailwind Active'].map((text) => (
            <div key={text} className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Globe className="w-5 h-5 text-blue-600" />,
            title: 'Smart Web Crawling',
            subtitle: 'Powered by Tavily API',
            description:
              'Paste any URL and our crawler extracts the most important content, generating relevant question-answer pairs.',
          },
          {
            icon: <Zap className="w-5 h-5 text-blue-600" />,
            title: 'AI FAQ Extraction',
            subtitle: 'Powered by OpenAI',
            description:
              'AI analyzes webpage content and generates comprehensive FAQ pairs to make information easy to digest.',
          },
          {
            icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
            title: 'Intelligent Chat',
            subtitle: 'Powered by CopilotKit',
            description:
              'Chat with your saved content. Ask questions, get summaries, and explore all your snapped pages.',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="border rounded-lg shadow hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 border-b bg-gray-100 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.subtitle}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
              <span className="inline-block border border-gray-300 text-xs px-2 py-1 rounded-full text-gray-500">
                Coming Soon
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Setup Status Section */}
      <section className="max-w-3xl mx-auto py-16 px-4 border-t">
        <h2 className="text-2xl font-bold text-center mb-8">Setup Verification</h2>
        <div className="space-y-4">
          <EnvironmentCheck
            service="Appwrite"
            status={checkEnvironmentVariable('NEXT_PUBLIC_APPWRITE_PROJECT_ID')}
            description="Backend database and authentication"
          />
          <EnvironmentCheck
            service="OpenAI"
            status={checkEnvironmentVariable('OPENAI_API_KEY')}
            description="AI-powered FAQ extraction and chat"
          />
          <EnvironmentCheck
            service="Tavily"
            status={checkEnvironmentVariable('TAVILY_API_KEY')}
            description="Intelligent web crawling service"
          />
        </div>
      </section>

      {/* Next Steps */}
      <section className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready for Phase 2?</h2>
        <p className="text-gray-600 mb-8">
          Your foundation is solid! Next, set up Appwrite for user authentication
          and database management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Configure Appwrite
          </button>
          <button className="border border-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-100">
            View Documentation
          </button>
        </div>
      </section>
    </div>
  );
}

function EnvironmentCheck({
  service,
  status,
  description,
}: {
  service: string;
  status: boolean;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${
            status ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        />
        <div>
          <div className="font-medium">{service}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
      <span className={`text-sm font-medium ${status ? 'text-green-600' : 'text-yellow-600'}`}>
        {status ? 'Configured' : 'Pending'}
      </span>
    </div>
  );
}

function checkEnvironmentVariable(varName: string): boolean {
  // Placeholder; replace with real server-side check or use public env
  return false;
}
