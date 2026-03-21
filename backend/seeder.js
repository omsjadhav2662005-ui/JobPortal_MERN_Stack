const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const User = require('./models/User');
const Job = require('./models/Job');
const Company = require('./models/Company');
const Application = require('./models/Application');

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await User.deleteMany(); await Job.deleteMany(); await Company.deleteMany(); await Application.deleteMany();
    const hash = (p) => bcrypt.hashSync(p, 12);

    const users = await User.insertMany([
      { name:'Admin User',    email:'admin@jobportal.com',  password: hash('admin123'),  role:'admin',     headline:'Platform Administrator',  skills:['Management','Strategy'] },
      { name:'Alice Johnson', email:'alice@jobportal.com',  password: hash('alice123'),  role:'employer',  headline:'HR Manager at Tech Corp',  location:'New York, NY',  skills:['Recruiting','HR'] },
      { name:'Bob Smith',     email:'bob@jobportal.com',    password: hash('bob123'),    role:'jobseeker', headline:'Full Stack Developer',     location:'San Francisco, CA', skills:['React','Node.js','MongoDB','TypeScript'] },
      { name:'Carol White',   email:'carol@jobportal.com',  password: hash('carol123'),  role:'jobseeker', headline:'UI/UX Designer',           location:'Remote',            skills:['Figma','UI/UX','Sketch','CSS'] },
      { name:'David Lee',     email:'david@jobportal.com',  password: hash('david123'),  role:'employer',  headline:'CTO at Innovate Ltd',      location:'Austin, TX',        skills:['Node.js','Python','AWS'] },
      { name:'Emma Brown',    email:'emma@jobportal.com',   password: hash('emma123'),   role:'jobseeker', headline:'Data Scientist',           location:'Chicago, IL',       skills:['Python','ML','TensorFlow','SQL'] },
    ]);
    const [admin, alice, bob, carol, david, emma] = users;

    const jobs = await Job.insertMany([
      { title:'Senior Frontend Developer', company:'Tech Corp', location:'New York, NY', type:'Full Time', salary:'$90k-$120k', salaryMin:90000, salaryMax:120000, category:'Technology', experienceLevel:'Senior Level', description:'Build cutting-edge React applications for millions of users. Work with a talented team on challenging problems.', requirements:['5+ years React experience','TypeScript proficiency','Experience with REST APIs','Strong communication skills'], responsibilities:['Build reusable UI components','Lead frontend architecture decisions','Mentor junior developers','Collaborate with designers'], skills:['React','TypeScript','CSS','Node.js'], companyDesc:'Tech Corp is a leading software innovator.', postedBy: alice._id },
      { title:'Backend Engineer', company:'Innovate Ltd', location:'Austin, TX', type:'Full Time', salary:'$110k-$140k', salaryMin:110000, salaryMax:140000, category:'Technology', experienceLevel:'Mid Level', description:'Design and build scalable APIs using Node.js and PostgreSQL.', requirements:['3+ years backend experience','Node.js / Express expertise','Database design skills'], responsibilities:['Build RESTful APIs','Design database schemas','Write unit tests'], skills:['Node.js','PostgreSQL','Docker','Redis'], companyDesc:'Innovate Ltd builds next-gen cloud solutions.', postedBy: david._id },
      { title:'UI/UX Designer', company:'Design Studio', location:'Remote', type:'Remote', salary:'$70k-$90k', salaryMin:70000, salaryMax:90000, category:'Design', experienceLevel:'Mid Level', description:'Design beautiful and functional user experiences for top brands.', requirements:['Portfolio of UI/UX work','Figma proficiency','Mobile-first design thinking'], responsibilities:['Create wireframes and prototypes','Conduct user research','Collaborate with developers'], skills:['Figma','UI/UX','Adobe XD','User Research'], companyDesc:'Creative agency with global clients.', postedBy: alice._id },
      { title:'Product Manager', company:'ProductHub', location:'Austin, TX', type:'Full Time', salary:'$100k-$130k', salaryMin:100000, salaryMax:130000, category:'Operations', experienceLevel:'Senior Level', description:'Drive product strategy and roadmap for our SaaS platform.', requirements:['5+ years PM experience','Technical background preferred','Data-driven mindset'], responsibilities:['Define product roadmap','Work with engineering and design','Analyze metrics'], skills:['Product Strategy','Agile','Analytics','Roadmapping'], companyDesc:'ProductHub is a fast-growing SaaS startup.', postedBy: david._id },
      { title:'DevOps Engineer', company:'CloudNet', location:'Seattle, WA', type:'Full Time', salary:'$115k-$145k', salaryMin:115000, salaryMax:145000, category:'Technology', experienceLevel:'Senior Level', description:'Manage cloud infrastructure and CI/CD pipelines for enterprise clients.', requirements:['AWS/GCP experience','Kubernetes expertise','Strong scripting skills'], responsibilities:['Maintain CI/CD pipelines','Monitor infrastructure','Automate deployments'], skills:['AWS','Kubernetes','Docker','Terraform','Python'], companyDesc:'CloudNet provides enterprise cloud infrastructure.', postedBy: alice._id },
      { title:'Data Analyst', company:'DataWorks', location:'Chicago, IL', type:'Part Time', salary:'$45k-$65k', salaryMin:45000, salaryMax:65000, category:'Technology', experienceLevel:'Entry Level', description:'Analyze datasets and create dashboards to drive business decisions.', requirements:['SQL proficiency','Excel / BI tools experience','Strong analytical thinking'], responsibilities:['Build dashboards','Analyze business data','Present insights to stakeholders'], skills:['SQL','Python','Tableau','Excel'], companyDesc:'DataWorks helps businesses make data-driven decisions.', postedBy: david._id },
      { title:'Marketing Intern', company:'BrandBoost', location:'Los Angeles, CA', type:'Internship', salary:'₹20k-₹25k', salaryMin:20000, salaryMax:25000, category:'Marketing', experienceLevel:'Entry Level', description:'Assist in social media campaigns and content creation.', requirements:['Marketing or Communications student','Creative mindset','Social media savvy'], responsibilities:['Create social media content','Assist with campaigns','Write blog posts'], skills:['Social Media','Content Writing','Canva','SEO'], companyDesc:'BrandBoost is a digital marketing agency.', postedBy: alice._id },
      { title:'Customer Support Specialist', company:'Supportify', location:'Remote', type:'Part Time', salary:'$28k-$38k', salaryMin:28000, salaryMax:38000, category:'Operations', experienceLevel:'Entry Level', description:'Help customers via chat and email, resolve issues with empathy.', requirements:['Excellent communication','Problem-solving skills','Patience and empathy'], responsibilities:['Handle customer inquiries','Resolve technical issues','Document solutions'], skills:['Customer Service','CRM Tools','Communication','Problem Solving'], companyDesc:'Supportify provides 24/7 customer support.', postedBy: david._id },
      { title:'React Native Developer', company:'MobileFirst', location:'Remote', type:'Remote', salary:'$80k-$110k', salaryMin:80000, salaryMax:110000, category:'Technology', experienceLevel:'Mid Level', description:'Build cross-platform mobile apps for iOS and Android.', requirements:['React Native expertise','Published apps on App Store / Play Store','API integration experience'], responsibilities:['Develop mobile features','Optimize app performance','Write clean maintainable code'], skills:['React Native','JavaScript','iOS','Android'], companyDesc:'MobileFirst specializes in mobile-first solutions.', postedBy: alice._id },
      { title:'Machine Learning Engineer', company:'DataWorks', location:'San Francisco, CA', type:'Full Time', salary:'$130k-$160k', salaryMin:130000, salaryMax:160000, category:'Technology', experienceLevel:'Senior Level', description:'Build and deploy ML models at scale for real-world products.', requirements:['PhD or MS in CS/ML preferred','PyTorch / TensorFlow experience','Production ML experience'], responsibilities:['Train and evaluate ML models','Deploy models to production','Research new techniques'], skills:['Python','TensorFlow','PyTorch','MLOps','SQL'], companyDesc:'DataWorks helps businesses make data-driven decisions.', postedBy: david._id },
    ]);

    await Company.insertMany([
      { name:'Tech Corp',    founded:'2015', employees:'250+', website:'https://techcorp.io',      industry:'Software', headquarters:'New York, NY',    tagline:'Innovation at scale',    benefits:['Health Insurance','Remote Friendly','401k Match','Gym Membership'], about:'Tech Corp builds world-class software products used by millions.' },
      { name:'Innovate Ltd', founded:'2018', employees:'120',  website:'https://innovateltd.com', industry:'Cloud',     headquarters:'Austin, TX',       tagline:'Building the future',    benefits:['Stock Options','Flexible Hours','Home Office Stipend'], about:'We build next-generation cloud-native solutions.' },
      { name:'Design Studio',founded:'2012', employees:'80',   website:'https://designstudio.co', industry:'Design',    headquarters:'New York, NY',    tagline:'Design that inspires',   benefits:['Creative Fridays','Workshops','Paid Time Off'], about:'Creative agency serving global brands.' },
      { name:'ProductHub',   founded:'2020', employees:'60',   website:'https://producthub.io',   industry:'SaaS',      headquarters:'Austin, TX',       tagline:'Product-led growth',     benefits:['Early Fridays','Health & Wellness','Learning Budget'], about:'A fast-growing SaaS startup focused on product excellence.' },
      { name:'CloudNet',     founded:'2016', employees:'400',  website:'https://cloudnet.com',    industry:'Cloud',     headquarters:'Seattle, WA',      tagline:'Powering the cloud',     benefits:['Global Team','Certification Reimbursement','Home Internet'], about:'Enterprise cloud infrastructure trusted by Fortune 500 companies.' },
      { name:'DataWorks',    founded:'2019', employees:'45',   website:'https://dataworks.tech',  industry:'Data',      headquarters:'Chicago, IL',      tagline:'Insights driven',        benefits:['Data Camp Subscription','Flexible Location','Equity'], about:'We turn raw data into actionable business intelligence.' },
      { name:'BrandBoost',   founded:'2021', employees:'25',   website:'https://brandboost.agency',industry:'Marketing',headquarters:'Los Angeles, CA',  tagline:'Amplify your brand',     benefits:['Social Events','Mentorship','Creative Tools'], about:'Digital marketing agency specializing in social & content.' },
      { name:'Supportify',   founded:'2017', employees:'150',  website:'https://supportify.io',   industry:'Support',   headquarters:'Remote',           tagline:'Support that scales',    benefits:['100% Remote','Wellness Days','Coaching'], about:'24/7 customer support solutions at scale.' },
      { name:'MobileFirst',  founded:'2022', employees:'30',   website:'https://mobilefirst.dev', industry:'Mobile',    headquarters:'Remote',           tagline:'Mobile-first, always',   benefits:['Remote First','Flexible Hours','Equipment Budget'], about:'We build beautiful, performant mobile apps.' },
    ]);

    console.log('✅ Data imported successfully!');
    console.log('📧 Test accounts:');
    console.log('  Employer : alice@jobportal.com  / alice123');
    console.log('  Jobseeker: bob@jobportal.com    / bob123');
    console.log('  Admin    : admin@jobportal.com  / admin123');
    process.exit();
  } catch (e) { console.error(e); process.exit(1); }
};

const destroyData = async () => {
  try {
    await User.deleteMany(); await Job.deleteMany(); await Company.deleteMany(); await Application.deleteMany();
    console.log('🗑️ Data destroyed');
    process.exit();
  } catch (e) { console.error(e); process.exit(1); }
};

if (process.argv[2] === '-d') destroyData(); else importData();
