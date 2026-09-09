const fs = require('fs');

let content = fs.readFileSync('src/components/FinancialAcademySection.tsx', 'utf8');

// Ensure event listener for navigate-to-academy
const eventHook = `
  useEffect(() => {
    const handleNavigate = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.topicId) {
        setExpandedTopicId(detail.topicId);
        // Also if topic matches, adjust filter
        setTimeout(() => {
          const el = document.getElementById('academy-topic-' + detail.topicId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    };
    window.addEventListener('navigate-to-academy', handleNavigate);
    return () => window.removeEventListener('navigate-to-academy', handleNavigate);
  }, []);
`;

// Insert the hook inside the component
if (!content.includes('navigate-to-academy')) {
  content = content.replace('const [activeGuideStep, setActiveGuideStep] = useState(0);', 'const [activeGuideStep, setActiveGuideStep] = useState(0);' + eventHook);
  content = content.replace('key={topic.id}', 'key={topic.id}\n                id={`academy-topic-${topic.id}`}');
  fs.writeFileSync('src/components/FinancialAcademySection.tsx', content);
  console.log('Successfully updated FinancialAcademySection with navigate-to-academy listener and element ids');
} else {
  console.log('Already has navigate-to-academy');
}
