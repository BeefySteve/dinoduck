# DinoDuck Multiplication/Division Game - Requirements

**Version**: 1.0  
**Status**: Final  
**Date**: April 14, 2026  
**Target Audience**: Children ages 6-7 years old

---

## 1. Functional Goals

### Primary Goals
1. **Make multiplication accessible** - Introduce multiplication concepts through visual, concrete representations aligned with how young learners naturally think about grouping and repeated addition
2. **Build confidence through mastery** - Progress through carefully scaffolded difficulty levels that reinforce understanding before introducing complexity
3. **Maintain engagement** - Use immediate positive feedback, celebration mechanics, and age-appropriate gamification to sustain motivation during learning
4. **Support progressive learning** - Enable teachers and parents to track progress across times tables (2, 5, 10) with clear extensibility for future advancement

### Secondary Goals
1. Provide visual/kinesthetic learning pathways that reinforce multiplication as organized groups
2. Eliminate anxiety around wrong answers through supportive feedback
3. Enable flexible access across devices (PWA-optimized for mobile and tablet)
4. Support flexible game configurations for different learning paces

---

## 2. Functional Requirements

### 2.1 Game Architecture & Module Integration

**REQ-001**: The Multiplication/Division game SHALL implement the standard DinoDuck game module interface with an `init(container, options)` function that accepts a DOM container element and optional configuration object.

**REQ-002**: The game SHALL accept an `onExit` callback function through the options parameter to enable return to the main game menu.

**REQ-003**: The game SHALL use an ES6 module export pattern compatible with the existing game loader in main.js.

### 2.2 Core Game Mechanics

**REQ-004**: The game SHALL present users with multiplication questions from currently selected times tables (initially 2, 5, and 10).

**REQ-005**: The game SHALL display multiplication questions in the format "[number] × [multiplier]" with clear visual hierarchy (minimum 2em font size for question display).

**REQ-006**: The game SHALL accept numeric text input via keyboard (including mobile numeric keyboards) for answer entry.

**REQ-007**: The game SHALL validate answers immediately after submission and provide synchronous feedback (correct/incorrect) within 300ms.

### 2.3 Difficulty Progression & Levels

**REQ-008**: The game SHALL implement a minimum of 3 difficulty levels sequenced as follows:
- **Level 1 (Foundation)**: Times table 2 with multipliers 1-5 (products 2-10)
- **Level 2 (Intermediate)**: Times table 5 with multipliers 1-5 (products 5-25)  
- **Level 3 (Advanced)**: Times table 10 with multipliers 1-5 (products 10-50)

**REQ-009**: Each level SHALL contain a target of 8 correct answers to advance to the next level.

**REQ-010**: The game SHALL track and display the current score (number of correct answers) throughout gameplay.

**REQ-011**: The game SHALL display level name and description (e.g., "Times Table 2") prominently at the start of each level.

**REQ-012**: Upon completing all three initial levels, the game SHALL end and display the final score with a "Play Again" option.

### 2.4 Question Variety & Randomization

**REQ-013**: For each times table, the game SHALL randomize multiplier order (not always ascending 1→5) to prevent pattern memorization.

**REQ-014**: The game SHALL not repeat the same exact question consecutively (multiplier not identical to previous question).

**REQ-015**: Questions for times table 2 SHALL use multipliers from the range [1-5].

**REQ-016**: Questions for times table 5 SHALL use multipliers from the range [1-5].

**REQ-017**: Questions for times table 10 SHALL use multipliers from the range [1-5].

### 2.5 Visual Feedback & User Experience

**REQ-018**: Upon correct answer submission, the game SHALL display positive feedback with:
- Visual indicator (e.g., "✓ Correct!" or emoji celebration)
- Score counter update  
- Automatic progression to next question after 800ms delay

**REQ-019**: Upon incorrect answer submission, the game SHALL display:
- Visual indicator (e.g., "✗ Not quite right.")
- Display of the correct answer in format "[number] × [multiplier] = [result]"
- Option to try again or an automatic reset after 1500ms

**REQ-020**: Upon accumulating 8 correct answers per level, the game SHALL display a celebration sequence including:
- Level-up animation (e.g., character animation or visual effect)
- Encouraging message (e.g., "Great job! Level Complete!")
- Duration of 1-2 seconds before proceeding to next level

**REQ-021**: The game SHALL maintain readable text and controls for touch input, with minimum button size of 44×44 pixels (AAA mobile accessibility standard).

### 2.6 Score Tracking & Game End

**REQ-022**: The game SHALL track and persist the score throughout all levels in the current game session.

---

## 3. Division Game Requirements

### Functional Goals

1. **Introduce division as inverse of multiplication** - Build on existing multiplication knowledge by showing division as "undoing" multiplication, using the same times tables (2, 5, 10) for conceptual consistency
2. **Develop conceptual understanding through concrete representations** - Use visual grouping and sharing models to help children grasp division as equal distribution before moving to abstract symbols
3. **Maintain engagement with age-appropriate challenges** - Provide progressive difficulty levels that build confidence while preventing frustration through supportive feedback
4. **Support flexible learning pathways** - Enable standalone division practice while preparing for combined multiplication/division activities

### Secondary Goals
1. Reinforce multiplication facts through inverse relationships
2. Build problem-solving skills with division word problems
3. Provide visual scaffolding that fades as mastery increases
4. Enable smooth transition to combined math fact fluency games

### Functional Requirements

**REQ-023**: The Division game SHALL implement the standard DinoDuck game module interface with an `init(container, options)` function that accepts a DOM container element and optional configuration object.

**REQ-024**: The game SHALL accept an `onExit` callback function through the options parameter to enable return to the main game menu.

**REQ-025**: The game SHALL use an ES6 module export pattern compatible with the existing game loader in main.js.

**REQ-026**: The game SHALL present users with division questions in the format "[dividend] ÷ [divisor] = ?" with clear visual hierarchy (minimum 2em font size for question display).

**REQ-027**: The game SHALL display division questions using the same times tables as multiplication (initially 2, 5, and 10) to maintain consistency.

**REQ-028**: The game SHALL accept numeric text input via keyboard (including mobile numeric keyboards) for answer entry.

**REQ-029**: The game SHALL validate answers immediately after submission and provide synchronous feedback (correct/incorrect) within 300ms.

**REQ-030**: The game SHALL implement a minimum of 3 difficulty levels sequenced as follows:
- **Level 1 (Foundation)**: Times table 2 with dividends 2-20 (quotients 1-10)
- **Level 2 (Intermediate)**: Times table 5 with dividends 5-50 (quotients 1-10)  
- **Level 3 (Advanced)**: Times table 10 with dividends 10-100 (quotients 1-10)

**REQ-031**: Each level SHALL contain a target of 8 correct answers to advance to the next level.

**REQ-032**: The game SHALL track and display the current score (number of correct answers) throughout gameplay.

**REQ-033**: The game SHALL display level name and description (e.g., "Times Table 2 Division") prominently at the start of each level.

**REQ-034**: Upon completing all three initial levels, the game SHALL end and display the final score with a "Play Again" option.

**REQ-035**: For each times table, the game SHALL randomize dividend order (not always ascending) to prevent pattern memorization.

**REQ-036**: The game SHALL not repeat the same exact question consecutively.

**REQ-037**: Questions for times table 2 SHALL use dividends from the range [2-20] with divisor 2.

**REQ-038**: Questions for times table 5 SHALL use dividends from the range [5-50] with divisor 5.

**REQ-039**: Questions for times table 10 SHALL use dividends from the range [10-100] with divisor 10.

**REQ-040**: Upon correct answer submission, the game SHALL display positive feedback with:
- Visual indicator (e.g., "✓ Correct!" or emoji celebration)
- Score counter update  
- Automatic progression to next question after 800ms delay

**REQ-041**: Upon incorrect answer submission, the game SHALL display:
- Visual indicator (e.g., "✗ Not quite right.")
- Display of the correct answer in format "[dividend] ÷ [divisor] = [result]"
- Option to try again or an automatic reset after 1500ms

**REQ-042**: Upon accumulating 8 correct answers per level, the game SHALL display a celebration sequence including:
- Level-up animation (e.g., character animation or visual effect)
- Encouraging message (e.g., "Great job! Division Level Complete!")
- Duration of 1-2 seconds before proceeding to next level

**REQ-043**: The game SHALL maintain readable text and controls for touch input, with minimum button size of 44×44 pixels (AAA mobile accessibility standard).

**REQ-044**: The game SHALL include visual representations for each division question showing grouping or sharing (e.g., circles with dots representing items being divided equally).

**REQ-045**: The visual representations SHALL use concrete objects (e.g., fruits, animals, or toys) that are age-appropriate and engaging for 6-7 year olds.

**REQ-046**: The game SHALL track and persist the score throughout all levels in the current game session.

---

## 4. Combined Multiplication/Division Game Requirements

### Functional Goals

1. **Integrate multiplication and division fluency** - Create a unified game that alternates between multiplication and division questions using the same times tables for comprehensive fact practice
2. **Reinforce inverse relationships** - Help children recognize that multiplication and division are complementary operations through mixed practice
3. **Maintain progressive difficulty** - Use the same level structure as individual games but with increased cognitive load from operation switching
4. **Build comprehensive math fact mastery** - Enable efficient practice of both operations in a single session

### Secondary Goals
1. Develop mental flexibility in switching between operations
2. Provide balanced practice opportunities
3. Support spaced repetition of related facts
4. Enable assessment of overall math fact fluency

### Functional Requirements

**REQ-047**: The Combined game SHALL implement the standard DinoDuck game module interface with an `init(container, options)` function that accepts a DOM container element and optional configuration object.

**REQ-048**: The game SHALL accept an `onExit` callback function through the options parameter to enable return to the main game menu.

**REQ-049**: The game SHALL use an ES6 module export pattern compatible with the existing game loader in main.js.

**REQ-050**: The game SHALL alternate between multiplication and division questions within the same gameplay session.

**REQ-051**: The game SHALL use the same times tables (2, 5, 10) and difficulty levels as the individual games.

**REQ-052**: The game SHALL randomize the sequence of operations (multiplication vs division) for each question to prevent predictability.

**REQ-053**: The game SHALL display questions in appropriate formats:
- Multiplication: "[number] × [multiplier] = ?"
- Division: "[dividend] ÷ [divisor] = ?"

**REQ-054**: The game SHALL accept numeric text input via keyboard (including mobile numeric keyboards) for answer entry.

**REQ-055**: The game SHALL validate answers immediately after submission and provide synchronous feedback (correct/incorrect) within 300ms.

**REQ-056**: The game SHALL implement a minimum of 3 difficulty levels with combined question targets:
- **Level 1 (Foundation)**: 12 total correct answers (6 multiplication + 6 division from times table 2)
- **Level 2 (Intermediate)**: 12 total correct answers (6 multiplication + 6 division from times table 5)  
- **Level 3 (Advanced)**: 12 total correct answers (6 multiplication + 6 division from times table 10)

**REQ-057**: Each level SHALL require completion of both multiplication and division questions to advance.

**REQ-058**: The game SHALL track and display separate scores for multiplication and division questions.

**REQ-059**: The game SHALL display level name and description (e.g., "Combined Times Table 2") prominently at the start of each level.

**REQ-060**: Upon completing all three levels, the game SHALL end and display final scores for both operations with a "Play Again" option.

**REQ-061**: The game SHALL randomize question order within each operation type to prevent pattern memorization.

**REQ-062**: The game SHALL not repeat the same exact question consecutively.

**REQ-063**: Upon correct answer submission, the game SHALL display positive feedback with:
- Visual indicator (e.g., "✓ Correct!" or emoji celebration)
- Score counter update for the appropriate operation
- Automatic progression to next question after 800ms delay

**REQ-064**: Upon incorrect answer submission, the game SHALL display:
- Visual indicator (e.g., "✗ Not quite right.")
- Display of the correct answer in appropriate format
- Option to try again or an automatic reset after 1500ms

**REQ-065**: Upon completing the required questions for a level, the game SHALL display a celebration sequence including:
- Level-up animation (e.g., character animation or visual effect)
- Encouraging message (e.g., "Amazing! Combined Level Complete!")
- Duration of 1-2 seconds before proceeding to next level

**REQ-066**: The game SHALL maintain readable text and controls for touch input, with minimum button size of 44×44 pixels (AAA mobile accessibility standard).

**REQ-067**: The game SHALL include visual representations for division questions showing grouping or sharing.

**REQ-068**: The game SHALL track and persist scores for both operations throughout the current game session.

---

## Acceptance Criteria

### Division Game

**Given** the Division game is loaded in a supported browser,  
**When** a child selects the Division game from the main menu,  
**Then** the game initializes with Level 1 (Times Table 2) and displays the first division question with visual grouping representation.

**Given** a child is playing the Division game at Level 1,  
**When** they submit a correct answer to "10 ÷ 2 = ?",  
**Then** the game shows positive feedback, updates the score, and automatically advances to the next question after 800ms.

**Given** a child submits an incorrect answer in the Division game,  
**When** the answer is wrong,  
**Then** the game displays "Not quite right", shows the correct answer "10 ÷ 2 = 5", and allows retry or auto-advances after 1500ms.

**Given** a child has answered 8 questions correctly in a Division level,  
**When** they complete the level,  
**Then** the game displays a celebration animation and message, then advances to the next level.

**Given** a child completes all three Division levels,  
**When** they finish Level 3,  
**Then** the game displays the final score and offers a "Play Again" option.

### Combined Game

**Given** the Combined game is loaded,  
**When** a child selects the Combined game,  
**Then** the game initializes with Level 1 and alternates between multiplication and division questions from times table 2.

**Given** a child is playing the Combined game,  
**When** they answer questions correctly,  
**Then** the game tracks separate scores for multiplication and division operations.

**Given** a child completes 6 multiplication and 6 division questions correctly in a Combined level,  
**When** they finish the level requirements,  
**Then** the game celebrates completion and advances to the next level.

**Given** a child finishes all Combined levels,  
**When** they complete Level 3,  
**Then** the game displays final scores for both operations and offers replay.  
**Status**: Draft  
**Date**: April 14, 2026  
**Target Audience**: Developers, educators, parents, and contributors interested in educational game development

---

### Functional Goals

1. **Inform and Attract Users**: Provide comprehensive information that clearly communicates the project's educational value, target audience, and unique "vibe coded" approach to attract parents, educators, and young learners.
2. **Guide Development and Setup**: Offer complete, step-by-step instructions for setting up and running the PWA locally, enabling developers to contribute effectively.
3. **Facilitate Contributions**: Establish clear guidelines for contributing new games and features, ensuring they align with the project's educational philosophy and age-appropriate standards.
4. **Promote Discoverability**: Include prominent publication URL, screenshots, and technical details to make the project easily discoverable and understandable.
5. **Ensure Accessibility and Compliance**: Incorporate information on licensing, support, and best practices to maintain an open-source, educational project that meets accessibility standards.

---

### Functional Requirements

**REQ-001**: The README SHALL include a prominent project title "DinoDuck Educational Games" followed by a clear description emphasizing it's a PWA with 10 mini-games for children aged 2-7 years old.

**REQ-002**: The README SHALL feature a dedicated "About" or "Project Description" section that explains the educational focus on math, letters, counting, spelling, tracing, and motor skills development.

**REQ-003**: The README SHALL prominently display the publication URL "https://dinoduck.games/" in the header or introduction section.

**REQ-004**: The README SHALL include a "Games" section listing all 10 mini-games (counting.js, dinosaur2.js, etc.) with brief descriptions of their educational objectives and target skills.

**REQ-005**: The README SHALL explain the "vibe coded" development philosophy as creative, fun, and child-friendly development that prioritizes engagement over perfection.

**REQ-006**: The README SHALL include a "Setup and Installation" section with complete PWA development instructions, including prerequisites (Node.js, HTTPS for local development), installation commands, and steps to run the application locally.

**REQ-007**: The README SHALL provide a "Technical Architecture" section overviewing the PWA structure, including manifest.json, service-worker.js, and offline functionality.

**REQ-008**: The README SHALL include a "Contributing" section with guidelines for adding new games, requiring contributors to ensure age-appropriateness, educational value, and adherence to the project's coding standards.

**REQ-009**: The README SHALL include a "License" section specifying the open-source license used for the project.

**REQ-010**: The README SHALL provide contact/support information, including links to issue trackers, discussion forums, or maintainer contact details.

**REQ-011**: The README SHALL include screenshots or demo links showcasing the games and user interface.

**REQ-012**: The README SHALL follow best practices for README documentation, including clear headings, code examples, and badges for build status or version information.

---

### Acceptance Criteria

**AC-001**: When a user first visits the README, the README SHALL display the project title, description, and publication URL within the first screen view.

**AC-002**: When a developer wants to set up the project locally, the README SHALL provide step-by-step instructions that result in a working PWA instance after following the setup section.

**AC-003**: When a contributor wants to add a new game, the README SHALL provide clear guidelines that ensure the new game meets educational objectives and age-appropriateness criteria.

**AC-004**: When a user seeks technical information, the README SHALL include an architecture overview that explains the PWA components and offline capabilities.

**AC-005**: When a user looks for support, the README SHALL provide contact information or links to appropriate channels for questions and feedback.

**AC-006**: When the README is viewed on different devices, the README SHALL remain readable and well-formatted on mobile, tablet, and desktop screens.

**AC-007**: When a parent or educator evaluates the project, the README SHALL clearly communicate the target age group (2-7 years) and educational benefits of each game.

**AC-008**: When the project is forked or cloned, the README SHALL include all necessary information for a new developer to understand the project structure and start contributing within 30 minutes.

---

# DinoDuck Homescreen Game Descriptions Enhancement

**Version**: 1.0  
**Status**: Proposed  
**Date**: April 14, 2026  
**Target Audience**: Children ages 6-7 years old

---

## 1. Functional Goals

### Primary Goals
1. **Enhance game discoverability** - Provide clear, engaging descriptions that help children understand what each game offers before selecting it
2. **Support independent play** - Enable children to make informed choices about which games to play based on age-appropriate descriptions
3. **Maintain visual appeal** - Preserve the existing emoji iconography while adding descriptive text that complements the visual design
4. **Improve accessibility** - Ensure descriptions are readable by screen readers and meet WCAG accessibility standards

### Secondary Goals
1. Reduce cognitive load by providing context for each game option
2. Support parental guidance by making game purposes transparent
3. Enable future game additions with consistent description patterns
4. Maintain mobile-first responsive design principles

---

## 2. Functional Requirements

### 2.1 Game Description Architecture

**REQ-024**: The homescreen SHALL display descriptive text for each game alongside the existing emoji icons.

**REQ-025**: Each game description SHALL be age-appropriate, using simple vocabulary suitable for 6-7 year olds (reading level equivalent to grades 1-2).

**REQ-026**: Game descriptions SHALL be concise, limited to 1-2 sentences per game (maximum 50 words total).

**REQ-027**: The homescreen SHALL maintain the existing grid layout while accommodating the additional descriptive text.

### 2.2 Content Requirements for Each Game

**REQ-028**: The maths game (🦖) description SHALL explain: "Add numbers and solve fun math problems! Start with easy sums and get better each time."

**REQ-029**: The multiplication game (🦖✕) description SHALL explain: "Learn times tables with dinosaurs! Practice 2s, 5s, and 10s in exciting levels."

**REQ-030**: The dinosaur2 game (🦖2) description SHALL explain: "Spell dinosaur names! Match letters to make words like 'cat' and 'dog'."

**REQ-031**: The dinosaur3 game (🦖3) description SHALL explain: "Mix math operations! Add, subtract, and multiply with dinosaur friends."

**REQ-032**: The dinosaur4 game (🦖4) description SHALL explain: "Trace letters and sounds! Learn ABCs and special letter pairs."

**REQ-033**: The letters game (🦆) description SHALL explain: "Find the letters! Match A to Z with pictures of things that start with each letter."

**REQ-034**: The counting game (🦆🦆) description SHALL explain: "Count the animals! See how many friends are hiding and count up to 12."

**REQ-035**: The duckduckduck game (🦆🦆🦆) description SHALL explain: "Tap the ducks! Touch the screen fast to make the ducks quack and splash."

**REQ-036**: The duckduckduckduck game (🦆🦆🦆🦆) description SHALL explain: "Draw with ducks! Follow the paths to make straight lines and fun shapes."

**REQ-037**: The train game (🚂) description SHALL explain: "Drive the train! Help the train find its way through mazes and around obstacles."

### 2.3 Visual Design and Layout

**REQ-038**: Each game button SHALL display the emoji icon prominently at the top, followed by the descriptive text below.

**REQ-039**: Game descriptions SHALL use a readable font size (minimum 16px) with adequate line spacing for mobile readability.

**REQ-040**: The layout SHALL be responsive, adapting from a 2-column grid on mobile to a 3-4 column grid on larger screens.

**REQ-041**: Game buttons SHALL maintain a minimum touch target size of 88x88 pixels (44x44pt) to meet accessibility standards.

### 2.4 Accessibility Requirements

**REQ-042**: All game descriptions SHALL be accessible to screen readers using proper ARIA labels or semantic HTML structure.

**REQ-043**: Text contrast SHALL meet WCAG AA standards (4.5:1 ratio minimum) for readability.

**REQ-044**: The interface SHALL support keyboard navigation, allowing users to tab through game options.

**REQ-045**: Game descriptions SHALL be available in the existing title attribute tooltips for hover states.

### 2.5 Content Maintenance

**REQ-046**: The system SHALL support easy updates to game descriptions through a centralized configuration object.

**REQ-047**: New games added to the homescreen SHALL follow the established pattern of emoji + description.

**REQ-048**: The homescreen SHALL gracefully handle games without descriptions by falling back to existing title-only display.

---

## 3. Acceptance Criteria

### Given the homescreen loads successfully
**When** a child views the game selection menu  
**Then** each game displays both an emoji icon and a clear description explaining what the game does

### Given a game has a description
**When** the description is displayed  
**Then** it uses simple words appropriate for 6-7 year olds and explains the game's main activity

### Given the homescreen on a mobile device
**When** the screen size changes  
**Then** the layout adapts responsively while keeping descriptions readable

### Given a screen reader is active
**When** navigating the homescreen  
**Then** the screen reader announces both the emoji description and the text description for each game

### Given a child hovers over a game button
**When** the tooltip appears  
**Then** it includes both the original title and the new descriptive text

### Given a new game is added to the system
**When** the homescreen is updated  
**Then** the new game follows the same emoji + description pattern without breaking the layout

**REQ-024**: Game state (score, level, question progress) SHALL reset when "Play Again" is selected or the user returns to the menu.

### 2.7 Input & Accessibility

**REQ-025**: The numeric input field SHALL:
- Accept only numeric characters (0-9)
- Auto-focus for keyboard input
- Support mobile numeric keyboard input mode (inputMode="numeric")
- Include an aria-label for screen readers

**REQ-026**: The game SHALL provide a large, clearly labeled submit button (text: "Check!" or equivalent) positioned near the input field.

**REQ-027**: All text content SHALL meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text).

### 2.8 Extensibility & Configuration

**REQ-028**: The game architecture SHALL support configuration of available times tables at initialization (initially hardcoded as [2, 5, 10], but structured to accept different values).

**REQ-029**: The game SHALL be designed to easily extend to additional times tables (3, 4, 6, 7, 8, 9, 11, 12) with minimal code changes—function to generate questions for any times table SHALL be parameterized.

**REQ-030**: Each times table extension SHALL follow the same level structure: multipliers 1-5 with 8 questions per level target.

**REQ-031**: Future feature: The game SHALL support difficulty selection UI allowing users/educators to choose subset of times tables (e.g., "Practice 5s and 10s only").

### 2.9 Responsive Design

**REQ-032**: The game container and all UI elements SHALL scale responsively for screen sizes from 320px width (mobile) to 1920px width (desktop).

**REQ-033**: Font sizes, button sizes, and spacing SHALL proportionally scale for mobile devices without breaking layout.

**REQ-034**: Touch targets (buttons) SHALL be minimum 44px × 44px on all screen sizes.

### 2.10 Error Handling & Edge Cases

**REQ-035**: If the user enters a non-numeric value or leaves input blank, the game SHALL display a clear error message (e.g., "Please enter a number") and not advance.

**REQ-036**: The game SHALL handle rapid button clicks (submission repeated quickly) by disabling the submit button until feedback is displayed, preventing double-submission.

---

## 3. Acceptance Criteria (EARS Syntax)

### 3.1 Level Progression

**AC-001: Times Table 2 Level Completion**
- **GIVEN** a user is playing the Multiplication game on Level 1 (Times Table 2)
- **WHEN** the user answers 8 questions correctly
- **THEN** a level-up celebration is displayed and Level 2 (Times Table 5) automatically starts after 1-2 seconds

**AC-002: Times Table 5 Level Completion**
- **GIVEN** a user has completed Level 1 and is now on Level 2 (Times Table 5)
- **WHEN** the user answers 8 questions correctly  
- **THEN** a level-up celebration is displayed and Level 3 (Times Table 10) automatically starts after 1-2 seconds

**AC-003: Times Table 10 Level Completion**
- **GIVEN** a user has completed Levels 1 and 2 and is on Level 3 (Times Table 10)
- **WHEN** the user answers 8 questions correctly
- **THEN** the game ends and displays final score with "Play Again" and "Back to Menu" options

### 3.2 Answer Validation & Feedback

**AC-004: Correct Answer Submission**
- **GIVEN** a user is presented with a multiplication question (e.g., "5 × 3")
- **WHEN** the user enters the correct answer (15) and clicks "Check!"
- **THEN** positive feedback is immediately displayed, score increments by 1, and the next question appears after 800ms

**AC-005: Incorrect Answer - First Attempt**
- **GIVEN** a user is presented with a multiplication question (e.g., "5 × 3")
- **WHEN** the user enters an incorrect answer (e.g., 10) and clicks "Check!"
- **THEN** the game displays negative feedback (e.g., "✗ Not quite right.") and shows the correct answer (5 × 3 = 15), and allows retry or auto-resets after 1500ms

**AC-006: Empty or Invalid Input**
- **GIVEN** a user is presented with a multiplication question
- **WHEN** the user clicks "Check!" without entering a value or enters non-numeric characters
- **THEN** the game displays an error message (e.g., "Please enter a number") and does not advance

### 3.3 Score Tracking

**AC-007: Score Increments on Correct Answer**
- **GIVEN** a user has answered 3 questions correctly (score = 3)  
- **WHEN** the user answers another question correctly
- **THEN** the score display updates to 4 before the next question loads

**AC-008: Score Persists Across Levels**
- **GIVEN** a user has answered 8 questions correctly on Level 1 (advances to Level 2, score = 8)
- **WHEN** the user answers 3 more questions correctly on Level 2
- **THEN** the score display shows 11 (not reset to 3)

**AC-009: Score Reset on Play Again**
- **GIVEN** a user has completed all levels with a final score of 24
- **WHEN** the user clicks "Play Again" button at the end screen
- **THEN** the game restarts with score reset to 0 and returns to Level 1

### 3.4 Question Generation & Randomization

**AC-010: Times Table 2 Questions Generated Correctly**
- **GIVEN** a user is on Level 1 (Times Table 2)
- **WHEN** 5 new questions are generated
- **THEN** all questions follow the format "2 × [1-5]" and produce correct answers in the range [2, 4, 6, 8, 10]

**AC-011: Times Table 5 Questions Generated Correctly**
- **GIVEN** a user is on Level 2 (Times Table 5)
- **WHEN** 5 new questions are generated
- **THEN** all questions follow the format "5 × [1-5]" and produce correct answers in the range [5, 10, 15, 20, 25]

**AC-012: Times Table 10 Questions Generated Correctly**
- **GIVEN** a user is on Level 3 (Times Table 10)
- **WHEN** 5 new questions are generated
- **THEN** all questions follow the format "10 × [1-5]" and produce correct answers in the range [10, 20, 30, 40, 50]

**AC-013: No Consecutive Identical Questions**
- **GIVEN** a user just answered a question (e.g., "2 × 3")
- **WHEN** the next question is generated
- **THEN** the new multiplier is not 3 (different from previous question)

### 3.5 Mobile & Responsive Behavior

**AC-014: Mobile Input on Small Screens**
- **GIVEN** a user is playing on a mobile device (320px width)
- **WHEN** the game loads on Level 1
- **THEN** the question is readable (minimum 1.5em font), input field is accessible without zooming, and the "Check!" button is at least 44×44 pixels

**AC-015: Responsive Button Sizing**
- **GIVEN** a user plays on different screen sizes (320px, 768px, 1920px)
- **WHEN** each screen is loaded
- **THEN** buttons remain a minimum of 44×44 pixels and are proportionally larger on bigger screens

---

## Homescreen UI Improvements Update

**Version**: 1.1  
**Status**: Updated  
**Date**: April 14, 2026  
**Target Audience**: Developers implementing the homescreen changes

---

### Functional Goals

1. **Reorder games for better user experience** - Place new shark-icon games (multiplication, division, combined) at the end of the menu after existing dinosaur and duck games to maintain familiarity for returning users.
2. **Update game descriptions for clarity and brevity** - Revise descriptions to be more concise and accurate, particularly for maths and dinosaur3 games.
3. **Add MIT license for open-source compliance** - Include a standard MIT license file to allow broad usage permissions as requested.

### Functional Requirements

**REQ-049**: The homescreen SHALL display games in the following order: maths, dinosaur2, dinosaur3, dinosaur4, letters, counting, duckduckduck, duckduckduckduck, train, multiplication, division, combined.

**REQ-050**: The maths game (🦖) description SHALL be updated to: "add numbers".

**REQ-051**: The dinosaur3 game (🦖3) description SHALL remain: "Mix math operations! Add, subtract, and multiply with dinosaur friends."

**REQ-052**: The multiplication game (🦈) description SHALL be: "Learn times tables with dinosaurs! Practice 2s, 5s, and 10s in exciting levels."

**REQ-053**: The division game (🦈) description SHALL be: "Learn division with dinosaurs! Practice dividing by 2s, 5s, and 10s in fun levels."

**REQ-054**: The combined game (🦈) description SHALL be: "Master multiplication and division together! Alternate between operations with dinosaur friends."

**REQ-055**: The project SHALL include a LICENSE file in the project root directory.

**REQ-056**: The LICENSE file SHALL contain the standard MIT License text, granting permissions for commercial use, modification, distribution, and private use.

### Acceptance Criteria

**Given** the homescreen loads successfully,  
**When** the games are listed in the menu,  
**Then** the games appear in the order: maths, dinosaur2, dinosaur3, dinosaur4, letters, counting, duckduckduck, duckduckduckduck, train, multiplication, division, combined.

**Given** the maths game is displayed,  
**When** the description is shown,  
**Then** it reads "add numbers".

**Given** the dinosaur3 game is displayed,  
**When** the description is shown,  
**Then** it reads "Mix math operations! Add, subtract, and multiply with dinosaur friends."

**Given** the multiplication game is displayed,  
**When** the description is shown,  
**Then** it reads "Learn times tables with dinosaurs! Practice 2s, 5s, and 10s in exciting levels."

**Given** the division game is displayed,  
**When** the description is shown,  
**Then** it reads "Learn division with dinosaurs! Practice dividing by 2s, 5s, and 10s in fun levels."

**Given** the combined game is displayed,  
**When** the description is shown,  
**Then** it reads "Master multiplication and division together! Alternate between operations with dinosaur friends."

**Given** the project repository is cloned,  
**When** the root directory is examined,  
**Then** a LICENSE file exists containing the MIT License text.

**Given** the MIT License is applied,  
**When** users review the license,  
**Then** it permits commercial use, modification, distribution, and private use without restrictions.

### 3.6 Game Menu Integration

**AC-016: Game Launch from Menu**
- **GIVEN** the user is on the DinoDuck main menu
- **WHEN** the user clicks the Multiplication/Division game button
- **THEN** the game initializes with Level 1 displayed (no errors in console)

**AC-017: Exit to Menu**
- **GIVEN** a user is playing the Multiplication game
- **WHEN** the user clicks the "Back to Menu" button at the end screen
- **THEN** the game container clears and the main menu is re-displayed

### 3.7 Celebration & Feedback Animations

**AC-018: Level Completion Celebration**
- **GIVEN** a user completes 8 correct answers on a level
- **WHEN** level completion is triggered
- **THEN** a visual celebration (animation/color flash) is displayed for 1-2 seconds with celebratory text (e.g., "Great job!")

**AC-019: Encouragement on Wrong Answers**
- **GIVEN** a user submits an incorrect answer
- **WHEN** feedback is displayed
- **THEN** the message is supportive (not punitive) and explains the correct answer without penalty to score

---

## 4. Future Extensibility Notes

The following features are NOT required for initial release but SHALL be considered in architecture:

1. **Difficulty Selection UI**: Allow users to choose specific times tables (2, 5, 10, or combination)
2. **Division Questions**: Implement reverse questions (e.g., "10 ÷ 2 = ?") as times tables mastery increases
3. **Timed Challenge Mode**: Optional speed-based challenges for advanced learners (no time pressure initially)
4. **Progress Persistence**: Save user progress across sessions using localStorage or backend persistence
5. **Customizable Difficulty Ranges**: Teachers/parents can adjust multiplier ranges (e.g., 1-10 instead of 1-5)
6. **Word Problem Variant**: "If you have 5 groups of 3 apples, how many apples total?" alongside pure multiplication
7. **Sound Effects**: Optional audio feedback for correct/incorrect answers (respecting accessibility preferences)
8. **Leaderboard/Badges**: Achievement tracking for repeated play and mastery

---

## 5. Out of Scope

- Subtraction or addition games (separate from multiplication focus)
- Memorization speed challenges for initial version
- Per-user progress persistence (future feature)
- Voice input or conversational interaction
- Animation editor or custom game themes

---

## 6. Related Architecture Notes

- **Module Pattern**: Follows existing DinoDuck game architecture (see maths.js for reference)
- **Testing Strategy**: Manual testing with ages 6-7 recommended to validate UX and question difficulty
- **Performance**: All operations (question generation, input validation, feedback) must complete within 300ms for responsive feel
- **Accessibility**: Must meet WCAG 2.1 AA standards for contrast and interactivity

---

**End of Requirements Document**

# DinoDuck Requirements Update - Emoji Icons and Homepage Descriptions

**Version**: 1.1  
**Status**: Update  
**Date**: April 14, 2026  
**Target Audience**: Developers, educators, parents, and contributors

---

## 1. Functional Goals

### Primary Goals
1. **Improve visual distinction** - Use varied, child-friendly emojis for multiplication and division games to enhance theme diversity and avoid confusion.
2. **Enhance user experience** - Shorten homepage game descriptions to make them more scannable and engaging for young children, reducing cognitive load.

### Secondary Goals
1. Maintain educational value while improving clarity.
2. Ensure emojis remain age-appropriate and thematic.

---

## 2. Functional Requirements

### 2.1 Emoji Icon Updates

**REQ-069**: The multiplication game SHALL use the shark emoji (🦈) combined with the multiplication symbol (×) as its icon (🦈×) to differentiate from other dinosaur-themed games.

**REQ-070**: The division game SHALL use the sauropod dinosaur emoji (🦕) combined with the division symbol (÷) as its icon (🦕÷) to provide visual variety.

### 2.2 Homepage Description Updates

**REQ-071**: The maths game (🦖) description SHALL be shortened to: "Add numbers and get better each level."

**REQ-072**: The multiplication game (🦈×) description SHALL be shortened to: "Learn times tables with sharks!"

**REQ-073**: The dinosaur2 game (🦖2) description SHALL be shortened to: "Spell words like 'cat' and 'dog'."

**REQ-074**: The dinosaur3 game (🦖3) description SHALL be shortened to: "Mix math with dinosaur friends."

**REQ-075**: The dinosaur4 game (🦖4) description SHALL be shortened to: "Trace letters and learn ABCs."

**REQ-076**: The letters game (🦆) description SHALL be shortened to: "Find letters A to Z with pictures."

**REQ-077**: The counting game (🦆🦆) description SHALL be shortened to: "Count animals up to 12."

**REQ-078**: The duckduckduck game (🦆🦆🦆) description SHALL be shortened to: "Tap ducks to make them splash."

**REQ-079**: The duckduckduckduck game (🦆🦆🦆🦆) description SHALL be shortened to: "Draw straight lines and shapes."

**REQ-080**: The train game (🚂) description SHALL be shortened to: "Drive the train through mazes."

---

## 3. Acceptance Criteria

**Given** the homescreen loads successfully,  
**When** a child views the game selection menu,  
**Then** the multiplication game displays the shark emoji (🦈×) and the division game displays the sauropod emoji (🦕÷).

**Given** the homescreen displays game descriptions,  
**When** descriptions are shown,  
**Then** each description is one short sentence maximum, clear, and engaging for 6-7 year olds.

**Given** a game description is updated,  
**When** the change is implemented,  
**Then** the description remains informative about the game's purpose while being significantly shorter than previous versions.

---

# DinoDuck Math Games Updates - User Feedback Implementation

**Version**: 1.2  
**Status**: Proposed  
**Date**: April 14, 2026  
**Target Audience**: Children ages 6-7 years old, developers implementing updates

---

## 1. Functional Goals

### Primary Goals
1. **Enhance homescreen clarity** - Update game descriptions to be more concise and consistent, improving user understanding and selection
2. **Improve game title consistency** - Standardize title formatting across multiplication and division games for better user experience
3. **Implement auto-focus for accessibility** - Ensure input fields automatically receive focus when new screens load, reducing friction for young users
4. **Randomize times table progression** - Prevent predictable learning patterns by randomizing the order of times tables (2, 5, 10)
5. **Extend level progression** - Add advanced levels to multiplication and division games to support continued learning
6. **Update wrong answer handling** - End games on incorrect answers to encourage accuracy while maintaining supportive feedback

### Secondary Goals
1. Maintain educational value and age-appropriateness throughout changes
2. Ensure consistency across all math games (multiplication, division, combined)
3. Support progressive learning without overwhelming young learners
4. Preserve existing positive feedback mechanisms while adjusting game flow

---

## 2. Functional Requirements

### 2.1 Homescreen UI Improvements

**REQ-081**: The dinosaur3 game (🦖3) description SHALL be updated to: "add, subtract and multiply"

**REQ-082**: The multiplication game (🦈×) description SHALL be updated to: "times tables (2s, 5s, 10s)"

**REQ-083**: The division game (🦕÷) description SHALL be updated to: "times tables (2s, 5s, 10s)"

**REQ-084**: The combined game (🦈) description SHALL be updated to: "multiply and divide"

### 2.2 Game Title Formatting Updates

**REQ-085**: The multiplication game level titles SHALL follow the format "[number] Times Table" (e.g., "2 Times Table" instead of "Times Table 2")

**REQ-086**: The division game level titles SHALL follow the format "[number] Times Table Division" (e.g., "2 Times Table Division" instead of "Times Table 2 Division")

**REQ-087**: The combined game level titles SHALL follow the format "[number] Times Table" with "2" appearing before "times table"

### 2.3 Input Focus Implementation

**REQ-088**: All math games (multiplication, division, combined) SHALL automatically focus the input field when a new question screen loads

**REQ-089**: The auto-focus SHALL be implemented by copying/reusing the existing focus mechanism from the original dino maths games

### 2.4 Times Table Randomization

**REQ-090**: The order of times tables (2, 5, 10) SHALL be randomized at the start of each game session instead of always starting with 2

**REQ-091**: The randomization SHALL apply to all math games (multiplication, division, combined) consistently

### 2.5 Level Progression Updates

**REQ-092**: The multiplication game SHALL add Level 4 that continues indefinitely with questions combining all three times tables (2, 5, 10)

**REQ-093**: The combined game SHALL add Level 4 that continues indefinitely with questions combining all three times tables (2, 5, 10)

**REQ-094**: The division game SHALL add Levels 4-6 that repeat the structure of Levels 1-3 but without apple emoji visual clues

**REQ-095**: The division game SHALL add Level 7 that continues indefinitely with questions combining all three times tables (2, 5, 10) without visual clues

### 2.6 Wrong Answer Behavior Updates

**REQ-096**: All math games SHALL end the current game session immediately when an incorrect answer is submitted

**REQ-097**: Upon game end due to wrong answer, the games SHALL display a final screen showing the combined score achieved, formatted consistently with the original dino maths games

**REQ-098**: The end screen SHALL include options to "Play Again" or return to the main menu

---

## 3. Acceptance Criteria

### Homescreen Description Updates

**Given** the homescreen loads successfully,  
**When** the dinosaur3 game is displayed,  
**Then** its description reads "add, subtract and multiply"

**Given** the homescreen loads successfully,  
**When** the multiplication game is displayed,  
**Then** its description reads "times tables (2s, 5s, 10s)"

**Given** the homescreen loads successfully,  
**When** the division game is displayed,  
**Then** its description reads "times tables (2s, 5s, 10s)"

**Given** the homescreen loads successfully,  
**When** the combined game is displayed,  
**Then** its description reads "multiply and divide"

### Game Title Formatting

**Given** the multiplication game loads Level 1,  
**When** the level title is displayed,  
**Then** it reads "2 Times Table" (not "Times Table 2")

**Given** the division game loads Level 1,  
**When** the level title is displayed,  
**Then** it reads "2 Times Table Division" (not "Times Table 2 Division")

**Given** the combined game loads Level 1,  
**When** the level title is displayed,  
**Then** it reads "2 Times Table" with the number appearing first

### Input Focus Implementation

**Given** a math game loads a new question screen,  
**When** the screen appears,  
**Then** the cursor is automatically positioned in the input field without requiring user interaction

**Given** the input focus mechanism is implemented,  
**When** compared to existing dino maths games,  
**Then** it uses the same focus implementation approach

### Times Table Randomization

**Given** a math game starts a new session,  
**When** the first level loads,  
**Then** it may be Times Table 2, 5, or 10 (not always 2)

**Given** multiple game sessions are played,  
**When** the starting times table is observed,  
**Then** the order varies across sessions (not predictable)

### Level Progression Updates

**Given** the multiplication game completes Level 3,  
**When** Level 4 begins,  
**Then** it continues indefinitely with randomized questions from all three times tables (2, 5, 10)

**Given** the combined game completes Level 3,  
**When** Level 4 begins,  
**Then** it continues indefinitely with randomized questions from all three times tables (2, 5, 10)

**Given** the division game completes Level 3,  
**When** Levels 4-6 load,  
**Then** they follow the same structure as Levels 1-3 but without apple emoji visual clues

**Given** the division game completes Level 6,  
**When** Level 7 begins,  
**Then** it continues indefinitely with randomized questions from all three times tables (2, 5, 10) without visual clues

### Wrong Answer Behavior

**Given** a user submits an incorrect answer in any math game,  
**When** the wrong answer is processed,  
**Then** the game ends immediately (no retry allowed)

**Given** a math game ends due to wrong answer,  
**When** the end screen displays,  
**Then** it shows the combined score achieved in the same format as original dino maths games

**Given** the end screen is displayed,  
**When** the user interacts with it,  
**Then** options include "Play Again" to restart or return to main menu
