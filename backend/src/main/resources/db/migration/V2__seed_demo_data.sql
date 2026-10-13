-- CAMPUSGIG Seed Data V2
-- Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_STUDENT'),
(2, 'ROLE_CLIENT'),
(3, 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Common Skills
INSERT INTO skills (id, name) VALUES
(1, 'React.js'),
(2, 'Java'),
(3, 'Spring Boot'),
(4, 'MySQL'),
(5, 'JavaScript'),
(6, 'TypeScript'),
(7, 'Node.js'),
(8, 'Python'),
(9, 'UI/UX Design'),
(10, 'Figma'),
(11, 'Docker'),
(12, 'REST APIs'),
(13, 'TailwindCSS'),
(14, 'Machine Learning'),
(15, 'Data Analysis')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Users (BCrypt hash for 'password123' is $2a$10$7j0pBwKzVn0K9yBsq.3Q0eYxKk6J0FzJvX9GqG9pD9k3jGz1vP7iC or handled by DataInitializer)
-- We insert demo users with a verified standard BCrypt representation
INSERT INTO users (id, email, password, full_name, phone, bio, avatar_url, role_id, enabled) VALUES
(1, 'client@campusgig.com', '$2a$10$Dow1Jn3G6nfx1sTq4bE2w.s7M6aI4PzFq7/9pA5vQo.H.r1K2mGv6', 'Dr. Evelyn Carter', '+1 555-0199', 'Director of Innovation at Apex Tech Labs. Mentoring students and hiring talented campus freelancers for real-world projects.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 2, TRUE),
(2, 'alex@campusgig.com', '$2a$10$Dow1Jn3G6nfx1sTq4bE2w.s7M6aI4PzFq7/9pA5vQo.H.r1K2mGv6', 'Alex Rivera', '+1 555-0142', 'Computer Science Junior at Stanford. Full-stack developer specializing in Spring Boot, React, and high-performance databases.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1, TRUE),
(3, 'sarah@campusgig.com', '$2a$10$Dow1Jn3G6nfx1sTq4bE2w.s7M6aI4PzFq7/9pA5vQo.H.r1K2mGv6', 'Sarah Chen', '+1 555-0183', 'Senior Design & HCI student at MIT. Passionate UI/UX designer and frontend specialist crafting modern, accessible web apps.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 1, TRUE),
(4, 'admin@campusgig.com', '$2a$10$Dow1Jn3G6nfx1sTq4bE2w.s7M6aI4PzFq7/9pA5vQo.H.r1K2mGv6', 'CampusGig Platform Admin', '+1 555-0100', 'CampusGig operations and community moderator.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 3, TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Student Profiles
INSERT INTO student_profiles (id, user_id, university, degree, graduation_year, hourly_rate, github_url, linkedin_url, website_url, experience_summary, contact_preference, rating_avg, review_count, total_earned, completed_projects) VALUES
(1, 2, 'Stanford University', 'B.S. Computer Science', 2026, 35.00, 'https://github.com/alexrivera', 'https://linkedin.com/in/alexrivera', 'https://alexrivera.dev', '2+ years building enterprise microservices with Spring Boot and reactive frontends in React. Completed 5 high-impact campus projects.', 'EMAIL', 4.90, 8, 2800.00, 5),
(2, 3, 'Massachusetts Institute of Technology', 'B.S. Human-Computer Interaction', 2025, 40.00, 'https://github.com/sarahchen', 'https://linkedin.com/in/sarahchen', 'https://sarahdesign.io', 'Award-winning UI/UX designer with 3+ years experience turning wireframes into production React components and Figma design systems.', 'EMAIL', 5.00, 11, 4200.00, 7)
ON DUPLICATE KEY UPDATE university=VALUES(university);

-- Student Skills Mapping
INSERT INTO student_skills (student_profile_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 11), (1, 12),
(2, 1), (2, 5), (2, 6), (2, 9), (2, 10), (2, 13)
ON DUPLICATE KEY UPDATE student_profile_id=VALUES(student_profile_id);

-- Portfolio Items
INSERT INTO portfolio_items (id, student_profile_id, title, description, project_url, image_url, tags) VALUES
(1, 1, 'UniRide - Student Carpool Platform', 'Full-stack ride matching service with live route tracking and payment splitting for university commuters.', 'https://github.com/alexrivera/uniride', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', 'React, Spring Boot, MySQL, Leaflet'),
(2, 1, 'Algorithmic Trading Dashboard', 'High-throughput stock analysis engine with WebSocket orderbook visualizer and REST telemetry.', 'https://github.com/alexrivera/algo-trader', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', 'Java, Spring Boot, WebSocket, Chart.js'),
(3, 2, 'DesignSystem Pro - React Component Library', 'WCAG AAA compliant accessible component kit with 45+ customizable design tokens and interactive storybook.', 'https://sarahdesign.io/system', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400', 'Figma, React, TailwindCSS, Storybook')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Freelance Services
INSERT INTO freelance_services (id, student_id, title, category, description, price, delivery_days, active) VALUES
(1, 2, 'Build Secure Spring Boot REST API & MySQL Database', 'Backend Development', 'I will architect and implement clean, documented Spring Boot REST APIs with Spring Security, JWT authentication, and MySQL relational schemas.', 150.00, 4, TRUE),
(2, 2, 'Full-Stack React + Spring Boot MVP Development', 'Full-Stack Development', 'Complete web application from wireframe to deployment including responsive frontend and robust backend services.', 350.00, 7, TRUE),
(3, 3, 'High-Conversion UI/UX Design & Figma Prototype', 'Design & Creative', 'Professional web and mobile application design in Figma including user journey, clickable prototypes, and design specs.', 180.00, 3, TRUE),
(4, 3, 'Modern Responsive Landing Page with React & Tailwind', 'Frontend Development', 'Fast, SEO-optimized, pixel-perfect responsive web page with engaging animations and mobile responsiveness.', 200.00, 3, TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Client Projects
INSERT INTO projects (id, client_id, title, category, description, budget, deadline, status) VALUES
(1, 1, 'Campus Event Ticketing & QR Check-in Platform', 'Web Development', 'We need a robust web platform where student clubs can publish events, manage ticket registrations, and scan attendee QR codes at venue doors in real time.', 600.00, DATE_ADD(CURRENT_DATE, INTERVAL 21 DAY), 'OPEN'),
(2, 1, 'Interactive Research Lab Dashboard & Data Visualization', 'Data & Analytics', 'Build an intuitive interactive dashboard to visualize laboratory sensor metrics, generate PDF weekly summaries, and filter timeseries datasets.', 450.00, DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY), 'OPEN'),
(3, 1, 'Alumni Mentorship Matching Portal Redesign', 'Design & Creative', 'Redesign the alumni mentorship web application UI/UX with modern aesthetics, clean user onboarding, and accessible matching interfaces.', 350.00, DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'IN_PROGRESS')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Project Required Skills
INSERT INTO project_required_skills (project_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 12),
(2, 1), (2, 5), (2, 12), (2, 15),
(3, 9), (3, 10), (3, 13)
ON DUPLICATE KEY UPDATE project_id=VALUES(project_id);

-- Proposals
INSERT INTO proposals (id, project_id, student_id, cover_letter, bid_amount, delivery_days, status) VALUES
(1, 1, 2, 'Hi Dr. Carter! I have extensive experience building Spring Boot and React applications with real-time features. I recently built UniRide with QR verification. I can deliver a secure, scalable ticketing solution in 14 days.', 550.00, 14, 'PENDING'),
(2, 3, 3, 'Hello! As an HCI student at MIT with award-winning UX portfolios, I would love to redesign the alumni portal. I will provide comprehensive Figma user flows and design tokens ready for developer handoff.', 350.00, 8, 'ACCEPTED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Contracts
INSERT INTO contracts (id, project_id, client_id, student_id, agreed_amount, status, notes) VALUES
(1, 3, 1, 3, 350.00, 'IN_PROGRESS', 'Contract established for Alumni Mentorship Portal Redesign. Delivery deadline set to 8 days.')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Milestones for Contract 1
INSERT INTO milestones (id, contract_id, title, description, amount, status, due_date) VALUES
(1, 1, 'Wireframes & User Journey Flow', 'Complete low-fidelity wireframes for student and mentor onboarding flows.', 150.00, 'COMPLETED', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY)),
(2, 1, 'High-Fidelity Interactive Prototype', 'Deliver Figma high-fidelity components and interactive clickable prototype.', 200.00, 'IN_PROGRESS', DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Conversations & Messages
INSERT INTO conversations (id, user_one_id, user_two_id, last_message_at) VALUES
(1, 1, 3, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE id=VALUES(id);

INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, is_read, created_at) VALUES
(1, 1, 1, 3, 'Welcome aboard, Sarah! Really impressed with your portfolio. Excited to see the alumni portal designs.', TRUE, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(2, 1, 3, 1, 'Thank you Dr. Carter! Milestone 1 wireframes are uploaded and ready for your feedback.', FALSE, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Notifications
INSERT INTO notifications (id, user_id, title, message, type, reference_id, is_read) VALUES
(1, 1, 'New Proposal Received', 'Alex Rivera submitted a proposal for "Campus Event Ticketing & QR Check-in Platform".', 'PROPOSAL_SUBMITTED', 1, FALSE),
(2, 3, 'Proposal Accepted!', 'Dr. Evelyn Carter accepted your proposal for "Alumni Mentorship Matching Portal Redesign".', 'PROPOSAL_ACCEPTED', 2, TRUE),
(3, 3, 'Contract Milestone Completed', 'Milestone 1 has been approved and marked complete.', 'STATUS_CHANGE', 1, FALSE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
