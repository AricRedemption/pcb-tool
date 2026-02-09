import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Layers, Workflow, ShieldAlert, ArrowRight, CircuitBoard, FileText, Award } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-white font-sans text-slate-900'>
      <header className='fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <CircuitBoard className='h-6 w-6 text-indigo-600' />
            <span className='font-bold text-lg tracking-tight'>{t('app.name')}</span>
          </div>
          <div className='flex items-center space-x-4'>
            <LanguageSwitcher />
            <Button variant='ghost' onClick={() => navigate('/login')}>
              {t('landing.login')}
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              {t('landing.hero.cta_primary')}
            </Button>
          </div>
        </div>
      </header>

      <section className='pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto'>
            {t('landing.hero.title')}
          </h1>
          <p className='text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed'>
            {t('landing.hero.subtitle')}
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Button size='lg' onClick={() => navigate('/dashboard')} className='w-full sm:w-auto'>
              {t('landing.hero.cta_primary')} <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
            <Button variant='outline' size='lg' className='w-full sm:w-auto'>
              {t('landing.hero.cta_secondary')}
            </Button>
          </div>

          <div className='mt-16 mx-auto max-w-5xl rounded-lg border border-slate-200 shadow-2xl bg-white overflow-hidden aspect-video relative'>
            <div className='absolute inset-0 bg-slate-100 flex items-center justify-center'>
              <span className='text-slate-400 font-mono text-sm'>
                {t('landing.preview')}
              </span>
            </div>
            <div className='absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm'>
              <ShieldAlert className='w-4 h-4 mr-1.5' />
              {t('landing.risk_passed')}
            </div>
          </div>
        </div>
      </section>

      <section className='py-24 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-3 gap-8'>
            <FeatureCard
              icon={<Layers className='h-8 w-8 text-indigo-600' />}
              title={t('landing.features.ia')}
              desc={t('landing.features.ia_desc')}
            />
            <FeatureCard
              icon={<Workflow className='h-8 w-8 text-amber-500' />}
              title={t('landing.features.workflow')}
              desc={t('landing.features.workflow_desc')}
            />
            <FeatureCard
              icon={<ShieldAlert className='h-8 w-8 text-rose-600' />}
              title={t('landing.features.risk')}
              desc={t('landing.features.risk_desc')}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-slate-900 text-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800'>
            <div className='p-4'>
              <div className='text-5xl font-extrabold mb-4 text-indigo-400'>{t('landing.stats.cycle')}</div>
              <div className='text-lg text-slate-300 font-medium'>{t('landing.stats.cycle_desc')}</div>
            </div>
            <div className='p-4'>
              <div className='text-5xl font-extrabold mb-4 text-emerald-400'>{t('landing.stats.iteration')}</div>
              <div className='text-lg text-slate-300 font-medium'>{t('landing.stats.iteration_desc')}</div>
            </div>
            <div className='p-4'>
              <div className='text-5xl font-extrabold mb-4 text-rose-400'>{t('landing.stats.defect')}</div>
              <div className='text-lg text-slate-300 font-medium'>{t('landing.stats.defect_desc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Intellectual Property Section */}
      <section className='py-24 bg-slate-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='flex items-center justify-center mb-4'>
              <Award className='h-10 w-10 text-indigo-600' />
            </div>
            <h2 className='text-3xl lg:text-4xl font-bold text-slate-900 mb-6'>{t('landing.ip.title')}</h2>
            <p className='text-xl text-slate-600 max-w-3xl mx-auto'>
              {t('landing.ip.desc')}
            </p>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className='bg-white border-slate-200 hover:shadow-lg transition-shadow duration-300'>
                <CardContent className='flex items-start p-6'>
                  <FileText className='h-6 w-6 text-indigo-500 mr-4 flex-shrink-0 mt-1' />
                  <span className='font-medium text-slate-700 leading-relaxed'>
                    {t(`landing.ip.list_${i}`)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className='bg-slate-50 border-t border-slate-200 py-12'>
        <div className='container mx-auto px-4 text-center text-slate-500 text-sm'>
          <p>{t('landing.footer')}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className='border-0 shadow-none bg-slate-50 hover:bg-slate-100 transition-colors'>
      <CardHeader>
        <div className='mb-4'>{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-base'>{desc}</CardDescription>
      </CardContent>
    </Card>
  );
}
