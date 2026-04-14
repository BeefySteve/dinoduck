# DinoDuck Educational Games

A Progressive Web App (PWA) featuring 12 mini-games designed for children aged 2-7 years old. Built with a "vibe coded" philosophy - creative, fun, and child-friendly development that prioritizes engagement over perfection.

## 🌐 Live Demo
[https://dinoduck.games/](https://dinoduck.games/)

## 🎯 Educational Focus
DinoDuck helps young learners develop essential skills through play:
- **Math Skills**: Addition, multiplication, division, and counting
- **Language Skills**: Letter recognition, spelling, and tracing
- **Motor Skills**: Drawing, tapping, and coordination
- **Problem Solving**: Pattern recognition and logical thinking

## 🎮 Games

### Dinosaur Games (Math Focus)
- **🦖 Dinosaur Maths**: Add numbers and solve fun math problems! Start with easy sums and get better each time.
- **🦈✕ Dinosaur Multiplication**: Learn times tables with sharks! Practice 2s, 5s, and 10s in exciting levels.
- **🦕÷ Dinosaur Division**: Practice division with dinosaurs! Learn to share and group numbers equally.
- **🦈🦕 Combined Multiplication & Division**: Mix multiplication and division facts. Master both operations together.
- **🦖2 Dinosaur 2**: Spell words like 'cat' and 'dog'.
- **🦖3 Dinosaur 3**: Mix math with dinosaur friends.
- **🦖4 Dinosaur 4**: Trace letters and learn ABCs.

### Duck Games (Skills Focus)
- **🦆 Duck Letters**: Find letters A to Z with pictures.
- **🦆🦆 Duck Duck**: Count animals up to 12.
- **🦆🦆🦆 Duck Duck Duck**: Tap ducks to make them splash.
- **🦆🦆🦆🦆 Duck Duck Duck Duck**: Draw straight lines and shapes.
- **🚂 Train**: Drive the train through mazes.

## 🚀 Setup and Installation

### Prerequisites
- Node.js (version 14 or higher)
- HTTPS setup for local development (required for PWA features)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dinoduck.git
   cd dinoduck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `https://localhost:3000` (HTTPS required for PWA)

### Building for Production
```bash
npm run build
```

## 🏗️ Technical Architecture

DinoDuck is built as a Progressive Web App with the following components:

- **manifest.json**: App manifest for PWA installation
- **service-worker.js**: Offline functionality and caching
- **Modular Game System**: Each game is an ES6 module with `init()` and `destroy()` functions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

## 🤝 Contributing

We welcome contributions! DinoDuck follows a "vibe coded" approach - focus on fun, educational value, and age-appropriateness.

### Guidelines for New Games
1. Ensure age-appropriateness for 2-7 year olds
2. Include clear educational objectives
3. Follow the existing module interface (`init(container, options)`)
4. Maintain accessibility standards
5. Test on multiple devices

### Development Process
1. Fork the repository
2. Create a feature branch
3. Add your game module to the `games/` directory
4. Update `main.js` to register the new game
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/BeefySteve/dinoduck/issues)
- **Discussions**: [GitHub Discussions](https://github.com/BeefySteve/dinoduck/discussions)


## 🙏 Acknowledgments

Built with love for young learners everywhere. Special thanks to the educational gaming community for inspiration and best practices.