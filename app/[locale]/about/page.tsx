'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const locale = useLocale();
  // const t = useTranslations();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Content is optimized for SEO, particularly in German
  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeIn} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
          {locale === 'de' ? 'Über das FHNW Studenten-Dashboard' : 'About the FHNW Student Dashboard'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          {locale === 'de' 
            ? 'Das inoffizielle FHNW Dashboard ist ein digitaler Assistent für Studierende der Fachhochschule Nordwestschweiz.' 
            : 'The unofficial FHNW Dashboard is a digital assistant for students at the University of Applied Sciences Northwestern Switzerland.'}
        </p>
      </motion.div>

      <motion.div variants={fadeIn} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {locale === 'de' ? 'Was bietet das FHNW Dashboard?' : 'What does the FHNW Dashboard offer?'}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
          <li>
            {locale === 'de' 
              ? 'Schneller Zugriff auf wichtige FHNW-Ressourcen für Studierende' 
              : 'Quick access to important FHNW resources for students'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Aktuelle Informationen zum Wetter auf dem Campus Brugg-Windisch' 
              : 'Current weather information for the Brugg-Windisch campus'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Die neuesten FHNW-News und Ankündigungen' 
              : 'Latest FHNW news and announcements'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Übersicht über Module, Noten und Studienverlauf' 
              : 'Overview of modules, grades, and study progress'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Interaktive Karte des FHNW-Campus' 
              : 'Interactive map of the FHNW campus'}
          </li>
        </ul>
      </motion.div>

      <motion.div variants={fadeIn} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {locale === 'de' ? 'Für wen ist das FHNW Dashboard?' : 'Who is the FHNW Dashboard for?'}
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          {locale === 'de' 
            ? 'Das Dashboard ist speziell entwickelt für:' 
            : 'The dashboard is specifically designed for:'}
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-600 dark:text-slate-300">
          <li>
            {locale === 'de' 
              ? 'Studierende der FHNW an allen Standorten (Brugg-Windisch, Basel, Olten, Muttenz)' 
              : 'FHNW students at all locations (Brugg-Windisch, Basel, Olten, Muttenz)'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Erstsemester, die sich mit der FHNW vertraut machen wollen' 
              : 'First-semester students who want to get familiar with FHNW'}
          </li>
          <li>
            {locale === 'de' 
              ? 'Austauschstudierende, die Informationen über die FHNW benötigen' 
              : 'Exchange students who need information about FHNW'}
          </li>
        </ul>
      </motion.div>

      <motion.div variants={fadeIn} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {locale === 'de' ? 'Häufig gestellte Fragen zum FHNW Dashboard' : 'Frequently Asked Questions about the FHNW Dashboard'}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {locale === 'de' 
                ? 'Ist dies eine offizielle FHNW-Anwendung?' 
                : 'Is this an official FHNW application?'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {locale === 'de' 
                ? 'Nein, dies ist ein inoffizielles Projekt, das von einem FHNW-Studenten erstellt wurde, um anderen Studierenden zu helfen.' 
                : 'No, this is an unofficial project created by an FHNW student to help other students.'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {locale === 'de' 
                ? 'Wie werden meine Daten geschützt?' 
                : 'How is my data protected?'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {locale === 'de' 
                ? 'Deine Daten werden lokal auf deinem Gerät gespeichert und nicht an unsere Server übermittelt. Wir respektieren deine Privatsphäre.' 
                : 'Your data is stored locally on your device and not transmitted to our servers. We respect your privacy.'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {locale === 'de' 
                ? 'Kann ich zum FHNW Dashboard beitragen?' 
                : 'Can I contribute to the FHNW Dashboard?'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {locale === 'de' 
                ? 'Ja, das Projekt ist Open Source. Du kannst auf GitHub Vorschläge machen oder direkt zum Code beitragen.' 
                : 'Yes, the project is open source. You can make suggestions or contribute directly to the code on GitHub.'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="text-center mt-12">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:text-lg"
        >
          {locale === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
        </Link>
      </motion.div>
    </motion.div>
  );
}