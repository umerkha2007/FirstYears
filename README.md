# FirstYears App 👶

**Day 4 of #30Days30Apps Challenge**

A personalized parenting assistant for the first year of your child's life. Built with React, this app provides AI-powered guidance tailored to your child's specific age and medical history — all stored locally in your browser.

## 🎯 Overview

FirstYears is a privacy-focused web application that helps parents of newborns to 1-year-olds get contextual parenting advice. Instead of repeatedly providing your child's details every time you ask a question, the app remembers your profile and automatically includes relevant context when generating responses.

## ✨ Features

- **Parent Profile Management**: Create and manage your own profile
- **Child Profile**: Store your child's information including:
  - Age/Date of birth
  - Medical history
  - Developmental milestones
- **AI-Powered Advice**: Get personalized parenting guidance using popular LLM APIs
- **Privacy First**: All data stored locally in your browser — nothing sent to external servers (except LLM API calls)
- **Context-Aware Responses**: Your child's information is automatically included in AI queries for relevant advice
- **Multi-Model Support**: Use your own API keys from popular LLM providers

## 🔒 Privacy & Data Storage

- **100% Local Storage**: All personal data is stored in your browser's local storage
- **No Backend Required**: Completely client-side application
- **Your API Keys**: Bring your own API keys — they never leave your browser
- **No Tracking**: Zero analytics or tracking scripts

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API key from at least one supported LLM provider

### Supported LLM Providers

- OpenAI (GPT-3.5, GPT-4)
- Anthropic (Claude)
- Google (Gemini)
- Other OpenAI-compatible APIs

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firstyears.git
cd firstyears
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎨 Tech Stack

- **React** - UI framework
- **Local Storage API** - Data persistence
- **CSS Modules / Styled Components** - Styling
- **LLM APIs** - AI-powered responses

## 📋 Usage

1. **First Time Setup**:
   - Enter your API key for your preferred LLM provider
   - Create your parent profile
   - Add your child's profile with relevant details

2. **Ask Questions**:
   - Type any parenting question in the chat interface
   - The app automatically includes your child's age and medical context
   - Receive personalized, contextual advice

3. **Update Profiles**:
   - Keep your child's age and milestones up to date
   - Add new medical history entries as needed

## 🛠️ Development

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

### Project Structure

```
firstyears/
├── public/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🤝 Contributing

This is a personal challenge project, but suggestions and feedback are welcome!

## ⚠️ Disclaimer

This app is designed to provide general parenting information and should not replace professional medical advice. Always consult with your pediatrician for medical concerns.

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🔗 Links

- Part of the [#30Days30Apps Challenge](https://github.com/yourusername/30Days30Apps)
- Day 4 Project

## 💡 Future Enhancements

- [ ] Export/Import profiles (encrypted JSON)
- [ ] Milestone tracking and reminders
- [ ] Growth chart visualization
- [ ] Multi-child support
- [ ] Offline mode with service workers
- [ ] Voice input for hands-free use

---

Built with ❤️ for new parents everywhere
