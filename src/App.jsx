/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App 
*/

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Briefcase, DollarSign, Clock, ChevronDown, ChevronUp, User, Bell, MessageSquare, LogOut, Sun, Moon, Settings, Calendar, Video, BookOpen, ExternalLink, UserPlus, Shield, CheckCircle, ArrowRight, VideoOff, Mic, ScreenShare, PlayCircle, PauseCircle, AlertTriangle, Award, Paperclip, Tags, Link as LinkIcon, X, ChevronLeft, ChevronRight, Monitor, FileText, Plus, PhoneCall, Video as VideoIcon } from 'lucide-react';

// --- PRICING LOGIC ---
const difficultyTiers = { Beginner: { rate: 12 }, Intermediate: { rate: 16 }, Expert: { rate: 20 } };
const calculatePay = (timeEstimateMinutes, difficulty) => {
    const hours = timeEstimateMinutes / 60;
    const rate = difficultyTiers[difficulty]?.rate || difficultyTiers.Beginner.rate;
    return Math.round(hours * rate);
};

// --- MOCK DATA (Expanded, Granular, & Dynamically Priced) ---
const rawJobTickets = [
    { id: 1, title: 'Draft 3 subject lines for welcome email', sprint: 'Sprint 2024-W30', discipline: 'Content', skills: ['Copywriting'], difficulty: 'Beginner', timeEstimate: 15, epic: 'User Onboarding Experience', owner: 'Sarah Chen', userStory: 'As a new user, I want to receive an email with an engaging subject line so that I feel excited to explore the platform.', acceptanceCriteria: ['Three distinct subject lines are provided.', 'Each is under 50 characters.', 'Tone is welcoming and aligns with brand voice.'], documents: [{name: 'Brand_Voice_Guide.pdf', url: '#'}], dependencies: [], tags: ['email', 'copywriting'], links: [] },
    { id: 2, title: 'Crop and resize 5 social media images', sprint: 'Sprint 2024-W30', discipline: 'Design', skills: ['Adobe Illustrator', 'Social Media'], difficulty: 'Beginner', timeEstimate: 20, epic: 'Q3 Social Media Campaign', owner: 'Alex Johnson', userStory: 'As a social media manager, I want properly sized images for Instagram Stories so that our posts look professional.', acceptanceCriteria: ['Five images are resized to 1080x1920px.', 'Aspect ratio is maintained.', 'Images are exported as JPGs under 200KB.'], documents: [{name: 'Image_Assets.zip', url: '#'}], dependencies: [], tags: ['design', 'social'], links: [] },
    { id: 3, title: 'Pull weekly Google Analytics traffic report', sprint: 'Sprint 2024-W30', discipline: 'Analytics', skills: ['Google Analytics 4'], difficulty: 'Beginner', timeEstimate: 30, epic: 'Weekly Performance Reporting', owner: 'Maria Garcia', userStory: 'As a marketing lead, I want a weekly traffic report so that I can monitor our website performance.', acceptanceCriteria: ['Report covers the last 7 full days.', 'Data includes Users, Sessions, and Source/Medium.', 'Exported as a CSV and uploaded to the shared drive.'], documents: [], dependencies: [], tags: ['reporting', 'analytics'], links: [] },
    { id: 4, title: 'Update React component with new color prop', sprint: 'Sprint 2024-W30', discipline: 'Development', skills: ['React', 'JavaScript'], difficulty: 'Intermediate', timeEstimate: 60, epic: 'Website Component Library', owner: 'David Lee', userStory: 'As a developer, I want to update the Button component so that it can accept a custom color prop for more flexible use.', acceptanceCriteria: ['The component accepts a `color` prop.', 'A default color is set if no prop is provided.', 'The change is documented in Storybook.'], documents: [{name: 'Component_Spec.md', url: '#'}], dependencies: [5], tags: ['frontend', 'react'], links: [{name: 'Staging Environment', url: '#'}] },
    { id: 5, title: 'Review competitor ad copy (3 competitors)', sprint: 'Sprint 2024-W31', discipline: 'Advertising', skills: ['PPC', 'Keyword Research'], difficulty: 'Intermediate', timeEstimate: 45, epic: 'Competitive Analysis Q3', owner: 'Emily White', userStory: 'As a PPC specialist, I want to analyze competitor ad copy so that I can identify opportunities for our campaigns.', acceptanceCriteria: ['Headlines and descriptions for 3 competitors are documented.', 'A brief summary of their value propositions is included.'], documents: [], dependencies: [], tags: ['research', 'ads'], links: [] },
    { id: 6, title: 'Create a simple wireframe for a modal', sprint: 'Sprint 2024-W31', discipline: 'Design', skills: ['Figma', 'UI/UX'], difficulty: 'Intermediate', timeEstimate: 90, epic: 'New Feature: User Profile Update', owner: 'Alex Johnson', userStory: 'As a product designer, I need a wireframe for a confirmation modal so that we can finalize the user flow for profile updates.', acceptanceCriteria: ['Wireframe includes a title, message body, a primary "Confirm" button, and a secondary "Cancel" button.'], documents: [], dependencies: [], tags: ['ui', 'wireframe'], links: [{name: 'Figma Board', url: '#'}] },
    { id: 7, title: 'Find 10 keywords for "B2B SaaS" topic', sprint: 'Sprint 2024-W31', discipline: 'Content', skills: ['SEO', 'Keyword Research'], difficulty: 'Beginner', timeEstimate: 45, epic: 'SEO Content Strategy', owner: 'Sarah Chen', userStory: 'As a content strategist, I want a list of relevant keywords so that I can plan our next series of blog posts.', acceptanceCriteria: ['10 long-tail keywords are provided.', 'Keywords have a search volume over 100.', 'Keyword difficulty is under 60.'], documents: [], dependencies: [], tags: ['seo', 'research'], links: [] },
    { id: 8, title: 'Set up a new HubSpot email list', sprint: 'Sprint 2024-W32', discipline: 'MarTech', skills: ['HubSpot'], difficulty: 'Beginner', timeEstimate: 30, epic: 'Webinar Follow-Up Campaign', owner: 'Maria Garcia', userStory: 'As a marketing operations specialist, I need to create a new list in HubSpot so that we can send follow-up emails to webinar attendees.', acceptanceCriteria: ['A static list named "Webinar Attendees Q3 2024" is created.', 'The provided CSV of contacts is successfully imported.'], documents: [{name: 'attendees.csv', url: '#'}], dependencies: [], tags: ['hubspot', 'email'], links: [] },
    { id: 9, title: 'Debug CSS issue on pricing page', sprint: 'Sprint 2024-W30', discipline: 'Development', skills: ['CSS', 'Bug Fixing'], difficulty: 'Expert', timeEstimate: 75, epic: 'Website Maintenance', owner: 'David Lee', userStory: 'As a user on Safari, I want the pricing page to display correctly so that I can easily compare plans.', acceptanceCriteria: ['The alignment issue on mobile Safari is resolved.', 'The fix does not negatively impact other browsers.', 'Code is clean and well-commented.'], documents: [], dependencies: [], tags: ['css', 'bug'], links: [{name: 'Live Pricing Page', url: '#'}] },
    { id: 10, title: 'Schedule 5 social media posts', sprint: 'Sprint 2024-W31', discipline: 'Advertising', skills: ['Social Media'], difficulty: 'Beginner', timeEstimate: 25, epic: 'Q3 Social Media Campaign', owner: 'Emily White', userStory: 'As a social media manager, I need to schedule approved posts for next week to ensure consistent content delivery.', acceptanceCriteria: ['Five posts are scheduled in Buffer.', 'Posts are set for Monday to Friday at 10 AM ET.'], documents: [{name: 'Approved_Posts.docx', url: '#'}], dependencies: [2], tags: ['social', 'scheduling'], links: [] },
    { id: 11, title: 'Transcribe 2-minute audio clip', sprint: 'Sprint 2024-W32', discipline: 'Content', skills: ['Transcription'], difficulty: 'Beginner', timeEstimate: 15, epic: 'Content Asset Creation', owner: 'Sarah Chen', userStory: 'As a content manager, I need a transcription of an audio clip to use as a quote in a blog post.', acceptanceCriteria: ['Transcription is at least 99% accurate.', 'Includes speaker labels (Interviewer, Guest).'], documents: [{name: 'interview_clip.mp3', url: '#'}], dependencies: [], tags: ['audio', 'content'], links: [] },
    { id: 12, title: 'Create a new GTM trigger', sprint: 'Sprint 2024-W32', discipline: 'Analytics', skills: ['GTM'], difficulty: 'Intermediate', timeEstimate: 40, epic: 'Website Analytics Enhancement', owner: 'Maria Garcia', userStory: 'As an analyst, I want to track all external link clicks so we can understand user behavior.', acceptanceCriteria: ['A new trigger named "External Link Click" is created in GTM.', 'The trigger fires on all clicks to URLs not containing our domain.'], documents: [], dependencies: [], tags: ['gtm', 'tracking'], links: [] },
    { id: 13, title: 'Design a banner for LinkedIn', sprint: 'Sprint 2024-W33', discipline: 'Design', skills: ['Figma', 'Social Media'], difficulty: 'Intermediate', timeEstimate: 60, epic: 'Q3 Social Media Campaign', owner: 'Alex Johnson', userStory: 'As a social media manager, I need a promotional banner for our upcoming webinar to post on LinkedIn.', acceptanceCriteria: ['Dimensions are 1200x627px.', 'Design aligns with the webinar topic and brand guidelines.'], documents: [{name: 'Brand_Assets.zip', url: '#'}], dependencies: [], tags: ['design', 'linkedin'], links: [] },
    { id: 14, title: 'Update WordPress plugin text', sprint: 'Sprint 2024-W32', discipline: 'Development', skills: ['WordPress'], difficulty: 'Beginner', timeEstimate: 20, epic: 'Website Maintenance', owner: 'David Lee', userStory: 'As a user, I want the button on the quote form to be clearer, so I know what to expect.', acceptanceCriteria: ['The button text in the "Quote Request" plugin is changed from "Submit" to "Get My Quote".'], documents: [], dependencies: [], tags: ['wordpress', 'copy'], links: [] },
    { id: 15, title: 'Research 5 influencers for collaboration', sprint: 'Sprint 2024-W33', discipline: 'Advertising', skills: ['Social Media', 'Research'], difficulty: 'Intermediate', timeEstimate: 120, epic: 'Influencer Marketing Initiative', owner: 'Emily White', userStory: 'As a marketing manager, I want a list of potential influencers to collaborate with to expand our reach.', acceptanceCriteria: ['List includes 5 influencers in the B2B tech space.', 'Follower counts are between 50k-200k.', 'A direct link to their primary social profile is provided for each.'], documents: [], dependencies: [], tags: ['influencer', 'research'], links: [] },
];
const mockJobTickets = rawJobTickets.map(ticket => ({ ...ticket, pay: calculatePay(ticket.timeEstimate, ticket.difficulty) }));
const mockWorkHistory = [ { id: 101, title: 'Proofread landing page copy', completionDate: '2024-07-20', pay: 50, status: 'Paid' }, { id: 102, title: 'Create icon set (5 icons)', completionDate: '2024-07-18', pay: 150, status: 'Approved' }, { id: 103, title: 'Draft 3 subject lines', completionDate: '2024-07-22', pay: 25, status: 'Submitted' } ];
const connectedAppsList = [ { name: 'Google', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' }, { name: 'Okta', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/okta/okta-original.svg' }, { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }, { name: 'Adobe', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' }, { name: 'Canva', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' }, { name: 'Meta', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg' }, { name: 'Semrush', icon: 'https://www.semrush.com/favicon.ico' }, { name: 'HubSpot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hubspot/hubspot-original.svg'}, { name: 'Slack', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg'}, { name: 'Jira', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg'}, { name: 'Trello', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg'}, { name: 'Notion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg'}, { name: 'Salesforce', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg'}, { name: 'Mailchimp', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mailchimp/mailchimp-original.svg'}, { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg'}, { name: 'Shopify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg'}, { name: 'Zoom', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zoom/zoom-original.svg'}, { name: 'Microsoft Teams', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftteams/microsoftteams-original.svg'}, { name: 'Asana', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/asana/asana-original.svg'}, { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'},  ];
const mockCalendarEvents = [ { date: '2024-08-01', title: 'SEO Blog Post Review' }, { date: '2024-08-15', title: 'Q3 Campaign Kickoff' } ];
const mockTeam = [ { id: 1, name: 'Sarah Chen (PM)', status: 'online' }, { id: 2, name: 'Alex Johnson (Design)', status: 'away' }, { id: 3, name: 'David Lee (Dev)', status: 'online' } ];
const mockChatData = {
    channels: [{ id: 'c1', name: 'general' }, { id: 'c2', name: 'design-team' }],
    dms: [{ id: 'd1', name: 'Sarah Chen', unread: 2 }, { id: 'd2', name: 'AI Assistant', unread: 0 }, {id: 'd3', name: 'Alex Johnson', unread: 0}],
    messages: {
        d1: [{ id: 1, sender: 'Sarah Chen', text: 'Hey, can you check the latest designs?' }, {id: 2, sender: 'You', text: 'Sure, taking a look now.'}],
        d2: [{ id: 1, sender: 'AI Assistant', text: 'Hello! How can I help you today?' }],
        d3: [{ id: 1, sender: 'Alex Johnson', text: 'The wireframes are ready for review in Figma.' }]
    }
};
const mockFaq = [
    { q: 'How do I get paid?', a: 'Payments are processed via Stripe at the end of each bi-weekly billing cycle. Ensure your payment details are correctly filled out in your profile.' },
    { q: 'What is the 15-minute rule?', a: 'After picking up a ticket, you have 15 minutes to start the timer. If you fail to do so, the ticket will be automatically unassigned and returned to the job board.' },
    { q: 'How does the bonus work?', a: 'If you successfully complete a task under the estimated time, you will receive a bonus of up to 5% of the base pay.' },
    { q: 'What happens if I go over the time estimate?', a: 'If your tracked time exceeds the estimate by more than 20%, the task will be automatically paused, and a project manager will be notified to review the task with you.' },
    { q: 'Can I work on multiple tickets at once?', a: 'No. To ensure focus and quality, freelancers are only allowed to have one active ticket at a time. The job board will be locked until your current task is complete.' },
    { q: 'What is screen recording for?', a: 'For certain tasks, a brief screen recording may be required as a deliverable to demonstrate the work completed. This will be specified in the task\'s acceptance criteria.' },
    { q: 'How do I submit a task for review?', a: 'Once you have completed all acceptance criteria, click the "Mark as Complete" button on your active task dashboard. This will stop the timer and notify the project manager.' },
    { q: 'Who do I contact if I have a question about a task?', a: 'Each task has a designated owner (Project Manager). You can reach out to them directly via the integrated Chat feature for any clarifications.' },
    { q: 'How are tasks priced?', a: 'Tasks are priced based on a combination of the estimated time to complete and a difficulty rating (Beginner, Intermediate, Expert). The hourly rate for each tier is fixed.' },
    { q: 'What are "Epics" and "Sprints"?', a: 'An "Epic" is a large body of work that can be broken down into smaller tasks. A "Sprint" is a set period of time during which specific work has to be completed and made ready for review. This is part of the AGILE methodology we use.' },
    { q: 'What happens after I enroll?', a: 'After your enrollment is submitted and approved, you will gain full access to the job board and all platform features. You will receive an email with your login credentials for connected apps like Google, Slack, etc.' },
    { q: 'How do I update my profile information?', a: 'You can update your personal details, skills, and payment information at any time from the "Profile & Work History" section, accessible from the user dropdown menu.' },
    { q: 'What are "Dependencies" on a task?', a: 'A dependency is a task that must be completed before another task can begin. If a task you picked has a dependency, you may need to wait until the preceding task is finished.' },
    { q: 'How does the AI Assistant work?', a: 'The AI Assistant in the chat can answer simple, common questions. For complex issues or task-specific questions, it\'s best to contact the project manager directly.' },
    { q: 'What are the different work history statuses?', a: '"Submitted" means you have completed the task and it is awaiting review. "Approved" means the project manager has approved your work and it is pending payment. "Paid" means the funds have been sent to your connected payment account.' },
];
const mockMeetings = [ { id: 1, title: 'Weekly Sync', time: 'in 30 minutes', link: '#' }, { id: 2, title: 'Design Review', time: 'Tomorrow, 11:00 AM', link: '#' }, ];

// --- HELPER & LAYOUT COMPONENTS ---
const ThemeToggle = ({ theme, toggleTheme }) => ( <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} </button> );
const Header = ({ theme, toggleTheme, setView, setAuth, activeTask, hasUnreadMessages }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const NavButton = ({ view, icon, label, hasNotification }) => {
        const isDisabled = !!activeTask;
        return (
            <button onClick={() => !isDisabled && setView(view)} className={`relative p-2 rounded-full text-gray-500 dark:text-gray-400 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} title={isDisabled ? 'Complete your active task to navigate' : label} disabled={isDisabled}>
                {icon}
                {hasNotification && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>}
            </button>
        );
    };
    return (
        <header className="bg-white dark:bg-[#0A2540] shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2">
                         <h1 className="text-3xl font-bold text-[#0A2540] dark:text-white cursor-pointer" onClick={() => setView(activeTask ? 'dashboard' : 'jobs')}> Service<span className="text-[#F18D13]">Legend</span> </h1>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <NavButton view="meetings" icon={<Video size={20} />} label="Meetings" />
                        <NavButton view="calendar" icon={<Calendar size={20} />} label="Calendar" />
                        <NavButton view="chat" icon={<MessageSquare size={20} />} label="Chat" hasNotification={hasUnreadMessages} />
                        <NavButton view="wiki" icon={<BookOpen size={20} />} label="Wiki" />
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <img className="h-9 w-9 rounded-full object-cover" src={`https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop`} alt="User Avatar" /> <ChevronDown size={16} className={`text-gray-600 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700">
                                    <a href="#" onClick={(e) => { e.preventDefault(); setView('profile'); setDropdownOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><User size={16} className="mr-2" /> Profile & Work History</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setView('connectedApps'); setDropdownOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><ExternalLink size={16} className="mr-2" /> Connected Apps</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setView('settings'); setDropdownOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Settings size={16} className="mr-2" /> API Settings</a>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setAuth(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><LogOut size={16} className="mr-2" /> Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// --- UNAUTHENTICATED VIEWS ---
const LandingView = ({ setView, setAuth }) => (
    <div className="bg-[#F6F9FC] dark:bg-[#051422]">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-6xl md:text-7xl font-bold text-[#0A2540] dark:text-white mb-4"> Service<span className="text-[#F18D13]">Legend</span> </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto"> Connect your skills with premier marketing and advertising technology projects. </p>
            <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <button onClick={() => setView('enroll')} className="bg-[#F18D13] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 flex items-center justify-center"> Enroll Now <ArrowRight className="inline ml-2" /> </button>
                <button onClick={() => setAuth(true)} className="bg-white dark:bg-gray-800 border-2 border-[#0A2540] dark:border-white text-[#0A2540] dark:text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"> Freelancer Login </button>
            </div>
        </div>
    </div>
);
const EnrollmentView = ({ setAuth, onEnrollmentComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        country: 'United States',
        taxId: '***-**-1234',
        paymentMethod: 'stripe',
        stripeEmail: 'jane.doe@stripe.com',
        portfolioUrl: 'https://jane-doe.design',
        bio: 'A passionate UX/UI designer with over 5 years of experience creating intuitive and beautiful user interfaces.',
        skills: ['Figma', 'UI/UX', 'Adobe Illustrator']
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleComplete = () => {
        onEnrollmentComplete(formData);
        setAuth(true);
    };

    const totalSteps = 3;
    const StepIndicator = ({ current, total }) => (
        <div className="flex justify-center items-center space-x-2 mb-8">
            {[...Array(total)].map((_, i) => (
                <React.Fragment key={i}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i + 1 <= current ? 'bg-[#F18D13] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>{i + 1}</div>
                    {i < total - 1 && <div className={`h-1 flex-1 ${i + 1 < current ? 'bg-[#F18D13]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-[#0A2540] dark:text-white mb-4">Freelancer Enrollment</h2>
            <StepIndicator current={step} total={totalSteps} />
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
                {step === 1 && <div><h3 className="text-xl font-semibold mb-4">Step 1: Personal Information</h3><div className="space-y-4"><label className="block"><span className="text-gray-700 dark:text-gray-300">Full Name</span><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600" /></label><label className="block"><span className="text-gray-700 dark:text-gray-300">Email Address</span><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600" /></label></div></div>}
                {step === 2 && <div><h3 className="text-xl font-semibold mb-4">Step 2: Legal & Payroll</h3><div className="space-y-4"><label className="block"><span className="text-gray-700 dark:text-gray-300">Tax ID (SSN/EIN)</span><input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600" /></label><label className="block"><span className="text-gray-700 dark:text-gray-300">Stripe Email</span><input type="email" name="stripeEmail" value={formData.stripeEmail} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600" /></label></div></div>}
                {step === 3 && <div><h3 className="text-xl font-semibold mb-4">Step 3: Skills & Profile</h3><div className="space-y-4"><label className="block"><span className="text-gray-700 dark:text-gray-300">Portfolio URL</span><input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600" /></label><label className="block"><span className="text-gray-700 dark:text-gray-300">Bio</span><textarea name="bio" value={formData.bio} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"></textarea></label></div></div>}
                <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg disabled:opacity-50">Back</button>
                    {step < totalSteps ? ( <button onClick={() => setStep(s => Math.min(totalSteps, s + 1))} className="bg-[#F18D13] text-white font-bold py-2 px-6 rounded-lg">Next</button> ) : ( <button onClick={handleComplete} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg">Complete Enrollment</button> )}
                </div>
            </div>
        </div>
    );
};

// --- AUTHENTICATED VIEWS ---
const SettingsView = () => (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6">API & Integration Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"><h3 className="text-xl font-semibold">ClickUp</h3></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"><h3 className="text-xl font-semibold">Google Workspace</h3></div>
        </div>
    </div>
);
const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workingDays, setWorkingDays] = useState({ 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false }); // Sun-Sat

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => null);
    const calendarDays = [...blanks, ...days];

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const toggleWorkingDay = (dayIndex) => {
        setWorkingDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6">My Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)}><ChevronLeft /></button>
                        <h3 className="text-xl font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)}><ChevronRight /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-bold text-xs uppercase text-gray-400">{day}</div>)}
                        {calendarDays.map((day, i) => (
                            <div key={i} className={`h-24 p-2 border dark:border-gray-700 rounded-md ${day ? (workingDays[new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay()] ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900') : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">Workday Settings</h4>
                    <div className="space-y-2">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                            <label key={day} className="flex items-center space-x-2"><input type="checkbox" checked={workingDays[i]} onChange={() => toggleWorkingDay(i)} className="h-4 w-4 text-[#F18D13] rounded border-gray-300 focus:ring-[#F18D13]" /><span>{day}</span></label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
const ChatView = () => {
    const [activeChat, setActiveChat] = useState('d2'); // Default to AI Assistant
    const [messages, setMessages] = useState(mockChatData.messages);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        
        const newMessages = { ...messages };
        const newMessage = { id: Date.now(), sender: 'You', text: inputText };
        newMessages[activeChat] = [...(newMessages[activeChat] || []), newMessage];

        // AI Bot Logic
        if (activeChat === 'd2') {
            setTimeout(() => {
                let botResponse = "I'm sorry, I don't understand that question. Could you rephrase it?";
                if (inputText.toLowerCase().includes('hello')) botResponse = "Hello there! How can I assist you today?";
                if (inputText.toLowerCase().includes('help')) botResponse = "Of course. You can find most information in the Wiki, or ask me about your current task status.";
                if (inputText.toLowerCase().includes('status')) botResponse = "You currently have no active tasks. Feel free to browse the jobs board!";
                
                const newBotMessage = { id: Date.now() + 1, sender: 'AI Assistant', text: botResponse };
                newMessages[activeChat] = [...newMessages[activeChat], newBotMessage];
                setMessages(newMessages);
            }, 1000);
        }
        
        setMessages(newMessages);
        setInputText('');
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6">Chat</h2>
            <div className="flex h-[calc(100vh-15rem)] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-2"><input type="text" placeholder="Search..." className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div className="flex-grow overflow-y-auto">
                        <h4 className="p-2 text-xs uppercase font-bold text-gray-400">Channels</h4>
                        {mockChatData.channels.map(c => <div key={c.id} onClick={() => setActiveChat(c.id)} className={`p-2 rounded-md mx-2 cursor-pointer ${activeChat === c.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}># {c.name}</div>)}
                        <h4 className="p-2 mt-4 text-xs uppercase font-bold text-gray-400">Direct Messages</h4>
                        {mockChatData.dms.map(dm => <div key={dm.id} onClick={() => setActiveChat(dm.id)} className={`p-2 rounded-md mx-2 cursor-pointer flex justify-between ${activeChat === dm.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}><span>{dm.name}</span>{dm.unread > 0 && <span className="bg-[#F18D13] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{dm.unread}</span>}</div>)}
                    </div>
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-lg">{mockChatData.dms.find(d=>d.id === activeChat)?.name || mockChatData.channels.find(c=>c.id === activeChat)?.name}</h3></div>
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {(messages[activeChat] || []).map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700"><input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type a message..." className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></form>
                </div>
            </div>
        </div>
    );
};
const MeetingsView = ({ setView }) => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-[#0A2540] dark:text-white">Meetings</h2><button onClick={() => setView('huddle')} className="bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-600 flex items-center transition-colors"> <Video className="mr-2" /> Start Instant Huddle </button></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8"><h3 className="text-xl font-semibold text-[#0A2540] dark:text-white mb-4">Upcoming Meetings</h3><ul className="divide-y divide-gray-200 dark:divide-gray-700">{mockMeetings.map(meeting => ( <li key={meeting.id} className="py-4 flex items-center justify-between"> <div><p className="font-semibold">{meeting.title}</p><p className="text-sm text-gray-500">{meeting.time}</p></div> <a href={meeting.link} className="bg-[#F18D13] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90">Join</a> </li> ))}</ul></div>
        </div>
    );
};
const ConnectedAppsView = () => (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6">Connected Apps</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">Connect your accounts to streamline your workflow and enable single sign-on for company tools.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {connectedAppsList.map(app => (
                <div key={app.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={app.icon} alt={app.name} className="w-8 h-8 mr-4" />
                        <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{app.name}</span>
                    </div>
                    <button className="bg-blue-500 text-white font-bold py-1 px-4 rounded-lg text-sm hover:bg-blue-600">Connect</button>
                </div>
            ))}
        </div>
    </div>
);
const ProfileView = ({ userProfile }) => {
    const getStatusColor = (status) => {
        if (status === 'Paid') return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        if (status === 'Approved') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        if (status === 'Submitted') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        return 'bg-gray-100 text-gray-800';
    }
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6">My Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <img className="h-24 w-24 rounded-full mx-auto mb-4 object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" alt="User Avatar" />
                        <h3 className="text-xl font-semibold">{userProfile?.fullName || 'Jane Doe'}</h3>
                        <p className="text-gray-500">UX/UI Designer</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold mb-4">Payment Information</h4>
                        <div className="flex items-center space-x-3"><svg className="w-10 h-auto" viewBox="0 0 60 25"><path fill="#6772e5" d="M59.64 14.28h-3.22c-.44 0-.8-.36-.8-.8s.36-.8.8-.8h2.41c.44 0 .8.36.8.8s-.36.8-.8.8h.81zm-6.13-1.6h2.15c.44 0 .8-.36.8-.8s-.36-.8-.8-.8h-2.15c-.44 0-.8.36-.8.8s.36.8.8.8zm-3.22 0h2.15c.44 0 .8-.36.8-.8s-.36-.8-.8-.8h-2.15c-.44 0-.8.36-.8.8s.36.8.8.8zM29.23 6.13c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm0 3.33c-.46 0-.83-.37-.83-.83s.37-.83.83-.83.83.37.83.83-.37.83-.83.83zm13.4 1.6h-2.15c-.44 0-.8-.36-.8-.8s.36-.8.8-.8h2.15c.44 0 .8.36.8.8s-.36.8.8.8zm-3.22 0h-2.15c-.44 0-.8-.36-.8-.8s.36-.8.8-.8h2.15c.44 0 .8.36.8.8s-.36.8.8.8zm-22.5-11.25c-2.4 0-4.35 1.95-4.35 4.35s1.95 4.35 4.35 4.35 4.35-1.95 4.35-4.35-1.95-4.35-4.35-4.35zm0 7.05c-1.49 0-2.7-1.21-2.7-2.7s1.21-2.7 2.7-2.7 2.7 1.21 2.7 2.7-1.21 2.7-2.7 2.7zm11.25-7.05c-2.4 0-4.35 1.95-4.35 4.35s1.95 4.35 4.35 4.35 4.35-1.95 4.35-4.35-1.95-4.35-4.35-4.35zm0 7.05c-1.49 0-2.7-1.21-2.7-2.7s1.21-2.7 2.7-2.7 2.7 1.21 2.7 2.7-1.21 2.7-2.7 2.7zM0 3.88v17.25h11.25V3.88H0zm9.6 15.6H1.65V5.53h7.95v13.95z"></path></svg><div><p className="font-semibold text-sm">Stripe Account</p><p className="text-xs text-gray-500">{userProfile?.stripeEmail || 'Not Connected'}</p></div></div><button className="text-sm text-blue-600 hover:underline mt-4 w-full text-left">Manage Account</button>
                    </div>
                    {userProfile && <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold mb-4">Onboarding Documents</h4>
                        <div className="space-y-2">
                            <a href="#" className="flex items-center text-blue-600 hover:underline"><Paperclip size={14} className="mr-2"/> W-9_Form_{userProfile.fullName.replace(' ','_')}.pdf</a>
                            <a href="#" className="flex items-center text-blue-600 hover:underline"><Paperclip size={14} className="mr-2"/> Skills_Profile_{userProfile.fullName.replace(' ','_')}.pdf</a>
                        </div>
                    </div>}
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold mb-4">Work History</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-full">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="py-2 px-2">Task</th><th className="py-2 px-2">Completed</th><th className="py-2 px-2">Pay</th><th className="py-2 px-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockWorkHistory.map(job => (
                                        <tr key={job.id} className="border-b dark:border-gray-700">
                                            <td className="py-3 px-2">{job.title}</td><td className="px-2">{job.completionDate}</td><td className="px-2">${job.pay}</td><td className="px-2"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(job.status)}`}>{job.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const TaskDetailsModal = ({ task, onClose, setActiveTask }) => {
    if (!task) return null;
    const bonusPay = Math.round(task.pay * 1.05);
    const handlePickUp = () => {
        setActiveTask(task);
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Epic: {task.epic}</p>
                        <h2 className="text-2xl font-bold text-[#0A2540] dark:text-white">{task.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Owned by: {task.owner}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 -mt-2 -mr-2"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div><h4 className="font-semibold mb-2 text-lg">User Story</h4><div className="prose prose-sm dark:prose-invert bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700"><blockquote>{task.userStory}</blockquote></div></div>
                    <div><h4 className="font-semibold mb-2 text-lg">Acceptance Criteria</h4><ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">{task.acceptanceCriteria.map((req, i) => <li key={i}>{req}</li>)}</ul></div>
                    {task.documents.length > 0 && <div><h4 className="font-semibold mb-2 text-lg">Attached Documents</h4>{task.documents.map((doc, i) => <a key={i} href={doc.url} className="flex items-center text-blue-600 hover:underline"><Paperclip size={14} className="mr-2" />{doc.name}</a>)}</div>}
                    {task.links.length > 0 && <div><h4 className="font-semibold mb-2 text-lg">Relevant Links</h4>{task.links.map((link, i) => <a key={i} href={link.url} className="flex items-center text-blue-600 hover:underline"><LinkIcon size={14} className="mr-2" />{link.name}</a>)}</div>}
                    {task.dependencies.length > 0 && <div><h4 className="font-semibold mb-2 text-lg">Dependencies</h4><p className="text-gray-600 dark:text-gray-300">This task depends on the completion of: Task-{task.dependencies.join(', Task-')}</p></div>}
                    <div className="flex flex-wrap gap-2 items-center"><Tags size={16} className="text-gray-400" />{task.tags.map(tag => <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}</div>
                </div>
                <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div><span className="text-sm text-gray-500">Pay Range</span><p className="text-xl font-bold text-green-600 dark:text-green-400">${task.pay} - ${bonusPay}</p></div>
                    <button onClick={handlePickUp} className="bg-[#F18D13] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90">Pick Up Task</button>
                </div>
            </div>
        </div>
    );
};
const JobsView = ({ setActiveTask }) => {
    const [filters, setFilters] = useState({ searchTerm: '', discipline: '', skills: [], sprint: '', minPay: '' });
    const [selectedTask, setSelectedTask] = useState(null);
    const allSkills = useMemo(() => [...new Set(mockJobTickets.flatMap(job => job.skills).flat())].sort(), []);
    const allDisciplines = useMemo(() => [...new Set(mockJobTickets.map(job => job.discipline))].sort(), []);
    const allSprints = useMemo(() => [...new Set(mockJobTickets.map(job => job.sprint))].sort(), []);
    const filteredJobs = useMemo(() => mockJobTickets.filter(job => {
        const searchTermMatch = job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || (job.userStory && job.userStory.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        const disciplineMatch = filters.discipline ? job.discipline === filters.discipline : true;
        const skillsMatch = filters.skills.length > 0 ? filters.skills.every(skill => job.skills.includes(skill)) : true;
        const sprintMatch = filters.sprint ? job.sprint === filters.sprint : true;
        const payMatch = filters.minPay ? job.pay >= Number(filters.minPay) : true;
        return searchTermMatch && disciplineMatch && skillsMatch && sprintMatch && payMatch;
    }), [filters]);
    const JobCard = ({ job }) => {
        const bonusPay = Math.round(job.pay * 1.05);
        const hourlyRate = (job.pay / (job.timeEstimate / 60)).toFixed(2);
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-[#0A2540] dark:text-white">{job.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 my-2">
                        <div className="flex items-center"><Briefcase size={14} className="mr-1.5" /><span>{job.discipline}</span></div>
                        <div className="flex items-center"><Clock size={14} className="mr-1.5" /><span>Est: {job.timeEstimate} min</span></div>
                    </div>
                    <div className="my-4">
                        <span className="text-xs text-gray-500">Pay Est. (~${hourlyRate}/hr)</span>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">${job.pay} - ${bonusPay}</p>
                    </div>
                </div>
                <div className="p-4 border-t dark:border-gray-600 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <button onClick={() => setSelectedTask(job)} className="text-sm font-medium text-blue-600 hover:underline">More Details</button>
                    <button onClick={() => setActiveTask(job)} className="bg-[#F18D13] text-white font-bold py-1 px-4 rounded-lg text-sm hover:bg-opacity-90">Pick Up</button>
                </div>
            </div>
        );
    };
    const FilterSidebar = () => (
        <aside className="w-full lg:w-1/4 xl:w-1/5 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24 h-full lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-[#0A2540] dark:text-white flex items-center"><SlidersHorizontal className="mr-2 text-[#F18D13]" />Filters</h2>
            <div className="mb-6"><label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label><div className="relative"><input type="text" id="search" placeholder="Keywords..." className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#F18D13] focus:border-[#F18D13] bg-white dark:bg-gray-700" value={filters.searchTerm} onChange={e => setFilters({ ...filters, searchTerm: e.target.value })} /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /></div></div>
            <div className="mb-6"><label htmlFor="sprint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sprint</label><select id="sprint" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#F18D13] focus:border-[#F18D13] bg-white dark:bg-gray-700" value={filters.sprint} onChange={e => setFilters({ ...filters, sprint: e.target.value })}><option value="">All Sprints</option>{allSprints.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="mb-6"><label htmlFor="discipline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discipline</label><select id="discipline" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#F18D13] focus:border-[#F18D13] bg-white dark:bg-gray-700" value={filters.discipline} onChange={e => setFilters({ ...filters, discipline: e.target.value })}><option value="">All Disciplines</option>{allDisciplines.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div className="mb-6"><p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</p><div className="space-y-2 max-h-48 overflow-y-auto pr-2">{allSkills.map(skill => (<div key={skill} className="flex items-center"><input id={`skill-${skill}`} type="checkbox" className="h-4 w-4 text-[#F18D13] border-gray-300 dark:border-gray-600 rounded focus:ring-[#F18D13] bg-gray-100 dark:bg-gray-700" checked={filters.skills.includes(skill)} onChange={e => { const newSkills = e.target.checked ? [...filters.skills, skill] : filters.skills.filter(s => s !== skill); setFilters({ ...filters, skills: newSkills }); }} /><label htmlFor={`skill-${skill}`} className="ml-3 text-sm text-gray-600 dark:text-gray-300">{skill}</label></div>))}</div></div>
            <button onClick={() => setFilters({ searchTerm: '', discipline: '', skills: [], sprint: '', minPay: '' })} className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> Clear All Filters </button>
        </aside>
    );
    return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="lg:flex lg:space-x-8">
                <FilterSidebar />
                <div className="w-full lg:flex-1 mt-6 lg:mt-0">
                    <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-[#0A2540] dark:text-white">Available Tasks ({filteredJobs.length})</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Browse and select tasks that match your skills.</p>
                    </div>
                    {filteredJobs.length > 0 ? ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{filteredJobs.map(job => <JobCard key={job.id} job={job} />)}</div> ) : ( <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"><Search size={48} className="mx-auto text-gray-400" /><h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No Matching Tasks Found</h3><p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p></div> )}
                </div>
            </div>
            <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} setActiveTask={setActiveTask} />
        </main>
    );
};
const ActiveTaskDashboard = ({ task, setActiveTask }) => {
    if (!task) return null; // Guard clause to prevent crash
    const [status, setStatus] = useState('pending');
    const [startTime, setStartTime] = useState(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [initialCountdown, setInitialCountdown] = useState(900);
    const [attachments, setAttachments] = useState([]);
    const [showRecordModal, setShowRecordModal] = useState(false);

    const timeEstimateSeconds = task.timeEstimate * 60;
    const pauseThresholdSeconds = timeEstimateSeconds * 1.2;

    const handleStartRecording = () => {
        setShowRecordModal(false); // Close the selection modal
        alert("Simulating screen recording for 10 seconds. In a real app, you would select a screen to share.");
        setTimeout(() => {
            setAttachments(prev => [...prev, { name: `Recording-${Date.now()}.webm`, url: '#' }]);
            alert("Recording finished and attached.");
        }, 10000);
    };

    useEffect(() => { if (status !== 'pending') return; if (initialCountdown <= 0) { alert('You did not start the timer within 15 minutes. The task has been unassigned.'); setActiveTask(null); return; } const timerId = setInterval(() => setInitialCountdown(c => c - 1), 1000); return () => clearInterval(timerId); }, [status, initialCountdown, setActiveTask]);
    useEffect(() => { if (status !== 'tracking') return; const timerId = setInterval(() => { setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000)); }, 1000); return () => clearInterval(timerId); }, [status, startTime]);
    useEffect(() => { if (elapsedSeconds > pauseThresholdSeconds && status === 'tracking') { setStatus('paused'); alert('Time has exceeded estimate by 20%. Task is paused for manager review.'); } }, [elapsedSeconds, pauseThresholdSeconds, status]);
    const handleStartTracking = () => { setStartTime(Date.now()); setStatus('tracking'); };
    const handleComplete = () => { setStatus('completed'); const bonusPay = Math.round(task.pay * 1.05); if (elapsedSeconds < timeEstimateSeconds) { alert(`Task complete! You earned a bonus. Total pay: $${bonusPay}`); } else { alert(`Task complete! Total pay: $${task.pay}`); } setActiveTask(null); };
    const formatTime = (seconds) => { const h = Math.floor(seconds / 3600).toString().padStart(2, '0'); const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${h}:${m}:${s}`; };
    const progressPercentage = Math.min((elapsedSeconds / pauseThresholdSeconds) * 100, 100);
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">Your Active Task</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{task.title}</p>
                {status === 'pending' && ( <div className="text-center bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"> <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} /> <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">Start Tracking Time</h3> <p className="text-yellow-600 dark:text-yellow-400 mt-2">You must begin tracking time within the next:</p> <div className="text-6xl font-mono font-bold text-yellow-800 dark:text-yellow-200 my-4">{formatTime(initialCountdown)}</div> <button onClick={handleStartTracking} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 flex items-center mx-auto"> <PlayCircle className="mr-2" /> Start Timer Now </button> </div> )}
                {(status === 'tracking' || status === 'paused') && ( <div> <div className="mb-6"> <div className="flex justify-between items-end mb-1"> <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Time Tracked</span> <span className="text-sm text-gray-500 dark:text-gray-400">Estimate: {formatTime(timeEstimateSeconds)}</span> </div> <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4"> <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div> </div> <div className="text-center text-4xl font-mono font-bold text-[#0A2540] dark:text-white my-4">{formatTime(elapsedSeconds)}</div> </div> {status === 'tracking' && ( <div className="flex items-center space-x-4"><button onClick={() => setShowRecordModal(true)} className="w-full bg-gray-200 dark:bg-gray-700 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-300 flex items-center justify-center"><ScreenShare className="mr-2" /> Record Screen</button><button onClick={handleComplete} className="w-full bg-[#F18D13] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 flex items-center justify-center"> <CheckCircle className="mr-2" /> Mark as Complete </button></div> )} {status === 'paused' && ( <div className="text-center bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6"> <PauseCircle className="mx-auto text-red-500 mb-4" size={48} /> <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">Task Paused</h3> <p className="text-red-600 dark:text-red-400 mt-2">Your tracked time has exceeded the estimate by over 20%. A project manager has been alerted and will contact you shortly.</p> </div> )} </div> )}
                {attachments.length > 0 && <div className="mt-6"><h4 className="font-semibold mb-2">Recordings</h4>{attachments.map((att, i) => <div key={i} className="flex items-center space-x-2"><VideoIcon className="text-gray-500" /><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{att.name}</a></div>)}</div>}
            </div>
            {showRecordModal && <RecordModal onClose={() => setShowRecordModal(false)} onConfirm={handleStartRecording} />}
        </div>
    );
};
const WikiView = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0A2540] dark:text-white mb-6 flex items-center"><BookOpen className="mr-3" /> Freelancer Wiki & FAQ</h2>
            <div className="space-y-4">{mockFaq.map((item, index) => (<div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"><button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full text-left p-4 flex justify-between items-center font-semibold text-lg"><span>{item.q}</span><ChevronDown className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`} /></button>{openIndex === index && <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"><p>{item.a}</p></div>}</div>))}</div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
function App() {
    const [theme, setTheme] = useState('light');
    const [isAuthenticated, setAuth] = useState(false);
    const [view, setView] = useState('landing');
    const [activeTask, setActiveTask] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const hasUnreadMessages = useMemo(() => Object.values(mockChatData.dms).some(dm => dm.unread > 0), []);

    useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    
    useEffect(() => {
        if (isAuthenticated && !userProfile) {
            // If logging in without enrolling, create a default profile
            setUserProfile({ fullName: 'Jane Doe', stripeEmail: 'Not Connected' });
            setView('jobs');
        } else if (!isAuthenticated) {
            setView('landing');
            setUserProfile(null); // Clear profile on logout
        }
    }, [isAuthenticated, userProfile]);
    
    useEffect(() => {
        if (activeTask) {
            setView('dashboard');
        } else {
            if(view === 'dashboard') {
                setView('jobs');
            }
        }
    }, [activeTask, view]);


    const renderAuthenticatedView = () => {
        switch (view) {
            case 'dashboard': return <ActiveTaskDashboard task={activeTask} setActiveTask={setActiveTask} />;
            case 'settings': return <SettingsView />;
            case 'calendar': return <CalendarView />;
            case 'chat': return <ChatView />;
            case 'meetings': return <MeetingsView setView={setView} />;
            case 'wiki': return <WikiView />;
            case 'connectedApps': return <ConnectedAppsView />;
            case 'profile': return <ProfileView userProfile={userProfile} />;
            case 'huddle': return <HuddleView setView={setView} />;
            case 'jobs':
            default: return <JobsView setActiveTask={setActiveTask} />;
        }
    };

    const renderUnauthenticatedView = () => {
        switch(view) {
            case 'enroll': return <EnrollmentView setAuth={setAuth} onEnrollmentComplete={setUserProfile} />;
            case 'landing':
            default: return <LandingView setView={setView} setAuth={setAuth} />;
        }
    };

    return (
        <div className="bg-[#F6F9FC] dark:bg-[#051422] min-h-screen font-sans">
            {isAuthenticated && <Header theme={theme} toggleTheme={toggleTheme} setView={setView} setAuth={setAuth} activeTask={activeTask} hasUnreadMessages={hasUnreadMessages} />}
            {isAuthenticated ? renderAuthenticatedView() : renderUnauthenticatedView()}
        </div>
    );
}

// --- MODALS AND SUB-COMPONENTS ---
const RecordModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Start Recording</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Choose what you want to record. This is a simulation and will not actually record your screen.</p>
            <div className="space-y-4">
                <button className="w-full flex items-center p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Monitor className="mr-3 text-blue-500" /><span>Entire Screen</span></button>
                <button className="w-full flex items-center p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><FileText className="mr-3 text-green-500" /><span>Application Window</span></button>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Start</button>
            </div>
        </div>
    </div>
);

const HuddleView = ({ setView }) => {
    const videoRef = useRef(null);
    const [team, setTeam] = useState(mockTeam.map(t => ({...t, ringing: false})));
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(err => console.error("Error accessing camera: ", err));
    }, []);

    const inviteUser = (id) => {
        setTeam(team.map(t => t.id === id ? {...t, ringing: true} : t));
        setTimeout(() => {
            setTeam(team.map(t => t.id === id ? {...t, ringing: false} : t));
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 text-white flex z-50">
            <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 bg-black rounded-lg relative">
                    <video ref={videoRef} autoPlay className="w-full h-full object-cover rounded-lg"></video>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4 bg-gray-800/50 p-3 rounded-full">
                        <button className="p-3 bg-gray-700 rounded-full"><Mic size={24} /></button>
                        <button className="p-3 bg-gray-700 rounded-full"><VideoOff size={24} /></button>
                        <button className="p-3 bg-red-500 rounded-full" onClick={() => setView('meetings')}><PhoneCall size={24} /></button>
                    </div>
                </div>
            </div>
            <div className="w-80 bg-gray-800 p-4">
                <h3 className="font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                    {team.map(member => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                <span>{member.name}</span>
                            </div>
                            <button onClick={() => inviteUser(member.id)} className={`text-sm px-3 py-1 rounded-full ${member.ringing ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}>{member.ringing ? 'Ringing...' : 'Invite'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;


