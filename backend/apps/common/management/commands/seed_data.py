"""
HackHub Seed Data Command
Populates the database with sample data for development & testing.
Usage: python manage.py seed_data
"""
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.certificates.models import Certificate
from apps.certificates.services import issue_certificate
from apps.hackathons.models import Hackathon, HackathonJudge, HackathonParticipant
from apps.judging.models import SubmissionScore
from apps.notifications.models import Notification
from apps.submissions.models import Submission
from apps.teams.models import Team, TeamInvitation, TeamJoinRequest, TeamMembership

User = get_user_model()

NOW = timezone.now()


def _d(offset_days=0, offset_hours=0):
    """Helper to create timezone-aware datetimes relative to now."""
    return NOW + timedelta(days=offset_days, hours=offset_hours)


USERS_DATA = [
    # (email, username, password, role, first_name, last_name, skills, is_verified)
    ("admin@hackhub.io", "admin", "password123", "admin", "System", "Admin", ["Python", "Django", "DevOps"], True),
    ("organizer@hackhub.io", "organizer1", "password123", "organizer", "Alice", "Johnson", ["Python", "Project Mgmt"], True),
    ("organizer2@hackhub.io", "organizer2", "password123", "organizer", "Bob", "Smith", ["JavaScript", "React"], True),
    ("judge@hackhub.io", "judge1", "password123", "judge", "Charlie", "Brown", ["Python", "ML", "Data Science"], True),
    ("judge2@hackhub.io", "judge2", "password123", "judge", "Diana", "Prince", ["Security", "Blockchain"], True),
    ("mentor@hackhub.io", "mentor1", "password123", "mentor", "Eve", "Adams", ["JavaScript", "Node.js"], True),
    ("participant@hackhub.io", "participant1", "password123", "participant", "Frank", "Miller", ["Python", "React"], True),
    ("participant2@hackhub.io", "participant2", "password123", "participant", "Grace", "Lee", ["JavaScript", "CSS"], True),
    ("participant3@hackhub.io", "participant3", "password123", "participant", "Henry", "Wilson", ["Go", "Docker"], True),
    ("participant4@hackhub.io", "participant4", "password123", "participant", "Ivy", "Chen", ["Python", "ML"], True),
    ("participant5@hackhub.io", "participant5", "password123", "participant", "Jack", "Davis", ["Rust", "WebAssembly"], False),
]

HACKATHONS_DATA = [
    {
        "title": "AI Innovation Challenge 2025",
        "status": Hackathon.STATUS_REGISTRATION_OPEN,
        "description": "Build AI-powered solutions to solve real-world problems. Open to all skill levels. Prizes include $10,000 and mentorship opportunities.",
        "registration_start": _d(-10),
        "registration_end": _d(14),
        "start_date": _d(21),
        "end_date": _d(25),
        "submission_deadline": _d(24, 23),
        "team_settings": {"min_size": 2, "max_size": 5, "allow_solo": False},
        "prizes": [
            {"rank": 1, "title": "Grand Prize", "value": "$10,000", "description": "Cash prize + mentorship"},
            {"rank": 2, "title": "Runner Up", "value": "$5,000", "description": "Cash prize"},
            {"rank": 3, "title": "Third Place", "value": "$2,000", "description": "Cash prize"},
        ],
        "scoring_criteria": [
            {"name": "Innovation", "maxScore": 25, "weight": 0.25},
            {"name": "Technical Complexity", "maxScore": 25, "weight": 0.25},
            {"name": "Design & UX", "maxScore": 20, "weight": 0.20},
            {"name": "Impact", "maxScore": 20, "weight": 0.20},
            {"name": "Presentation", "maxScore": 10, "weight": 0.10},
        ],
    },
    {
        "title": "GreenTech Hackathon",
        "status": Hackathon.STATUS_ONGOING,
        "description": "Create sustainable technology solutions for environmental challenges. Focus on climate change, renewable energy, and conservation.",
        "registration_start": _d(-30),
        "registration_end": _d(-5),
        "start_date": _d(-2),
        "end_date": _d(3),
        "submission_deadline": _d(2, 23),
        "team_settings": {"min_size": 2, "max_size": 4, "allow_solo": True},
        "prizes": [
            {"rank": 1, "title": "Green Champion", "value": "$7,000", "description": "Cash + incubation"},
        ],
        "scoring_criteria": [
            {"name": "Environmental Impact", "maxScore": 30, "weight": 0.30},
            {"name": "Innovation", "maxScore": 25, "weight": 0.25},
            {"name": "Feasibility", "maxScore": 25, "weight": 0.25},
            {"name": "Team Presentation", "maxScore": 20, "weight": 0.20},
        ],
    },
    {
        "title": "Web3 & Blockchain Hackathon",
        "status": Hackathon.STATUS_JUDGING,
        "description": "Explore decentralized applications, smart contracts, and blockchain technology. Build the future of web3.",
        "registration_start": _d(-60),
        "registration_end": _d(-35),
        "start_date": _d(-30),
        "end_date": _d(-26),
        "submission_deadline": _d(-27, 23),
        "team_settings": {"min_size": 1, "max_size": 4, "allow_solo": True},
        "prizes": [
            {"rank": 1, "title": "Best dApp", "value": "5 ETH + $3,000", "description": "Crypto + cash"},
            {"rank": 2, "title": "Best Smart Contract", "value": "2 ETH + $1,000", "description": ""},
        ],
        "scoring_criteria": [
            {"name": "Technical Implementation", "maxScore": 30, "weight": 0.30},
            {"name": "Innovation", "maxScore": 25, "weight": 0.25},
            {"name": "Security", "maxScore": 25, "weight": 0.25},
            {"name": "Documentation", "maxScore": 20, "weight": 0.20},
        ],
    },
    {
        "title": "HealthTech Hackathon",
        "status": Hackathon.STATUS_COMPLETED,
        "description": "Build technology solutions for healthcare - telemedicine, health monitoring, medical AI, and patient care systems.",
        "registration_start": _d(-90),
        "registration_end": _d(-65),
        "start_date": _d(-60),
        "end_date": _d(-56),
        "submission_deadline": _d(-57, 23),
        "prizes": [
            {"rank": 1, "title": "Healthcare Innovation Award", "value": "$15,000", "description": "Cash + hospital partnership"},
            {"rank": 2, "title": "Runner Up", "value": "$8,000", "description": "Cash"},
            {"rank": 3, "title": "People's Choice", "value": "$3,000", "description": "Cash"},
        ],
        "scoring_criteria": [
            {"name": "Medical Impact", "maxScore": 30, "weight": 0.30},
            {"name": "Technical Quality", "maxScore": 25, "weight": 0.25},
            {"name": "Usability", "maxScore": 25, "weight": 0.25},
            {"name": "Business Potential", "maxScore": 20, "weight": 0.20},
        ],
    },
    {
        "title": "EdTech Hackathon: Future of Learning",
        "status": Hackathon.STATUS_DRAFT,
        "description": "Reimagine education through technology. Build platforms and tools that make learning accessible, engaging, and effective.",
        "registration_start": _d(14),
        "registration_end": _d(44),
        "start_date": _d(50),
        "end_date": _d(54),
        "submission_deadline": _d(53, 23),
        "prizes": [{"rank": 1, "title": "Education Impact Award", "value": "$12,000", "description": "Cash + pilot program"}],
        "scoring_criteria": [
            {"name": "Educational Impact", "maxScore": 30, "weight": 0.30},
            {"name": "Accessibility", "maxScore": 25, "weight": 0.25},
            {"name": "Technical Innovation", "maxScore": 25, "weight": 0.25},
            {"name": "Scalability", "maxScore": 20, "weight": 0.20},
        ],
    },
    {
        "title": "Cybersecurity Hackathon",
        "status": Hackathon.STATUS_PUBLISHED,
        "description": "Identify vulnerabilities, build security tools, and develop innovative approaches to cybersecurity challenges.",
        "registration_start": _d(7),
        "registration_end": _d(28),
        "start_date": _d(35),
        "end_date": _d(38),
        "submission_deadline": _d(37, 23),
        "prizes": [{"rank": 1, "title": "Security Champion", "value": "$8,000", "description": "Cash + security conference pass"}],
        "scoring_criteria": [
            {"name": "Technical Depth", "maxScore": 35, "weight": 0.35},
            {"name": "Practical Impact", "maxScore": 30, "weight": 0.30},
            {"name": "Documentation", "maxScore": 20, "weight": 0.20},
            {"name": "Presentation", "maxScore": 15, "weight": 0.15},
        ],
    },
]

TEAMS_DATA = [
    # (name, hackathon_index, leader_participant_idx, member_participant_indices, status, looking_for_skills)
    # participant1=0, participant2=1, participant3=2, participant4=3, participant5=4
    ("AI Wizards", 0, 0, [1], Team.STATUS_ACTIVE, ["ML", "Data Engineering"]),
    ("Code Crusaders", 0, 1, [0], Team.STATUS_ACTIVE, ["Backend", "DevOps"]),
    ("Green Giants", 1, 2, [3], Team.STATUS_ACTIVE, ["IoT", "Hardware"]),
    ("Eco Warriors", 1, 3, [2], Team.STATUS_SUBMITTED, []),
    ("Web3 Pioneers", 2, 0, [1, 2], Team.STATUS_SUBMITTED, []),
    ("Smart Contractors", 2, 1, [4], Team.STATUS_SUBMITTED, []),
    ("Health Heroes", 3, 2, [0, 3], Team.STATUS_SUBMITTED, []),
    ("MedTech Innovators", 3, 3, [1, 4], Team.STATUS_SUBMITTED, []),
]

SUBMISSIONS_DATA = [
    # (team_index, project_title, description, github_url, tech_stack, status, final_score, rank)
    {
        "team_index": 4,
        "project_title": "DeCentral: Decentralized Identity Platform",
        "description": "A blockchain-based self-sovereign identity platform that lets users control their digital identity without relying on centralized authorities. Built on Ethereum with zk-rollups for scalability.",
        "github_url": "https://github.com/hackhub/decentral",
        "tech_stack": ["Solidity", "React", "TypeScript", "Hardhat", "IPFS"],
        "status": Submission.STATUS_UNDER_REVIEW,
        "final_score": 88.5,
        "rank": None,
    },
    {
        "team_index": 5,
        "project_title": "SafeVault: Smart Contract Auditor",
        "description": "Automated security analysis tool for Solidity smart contracts. Uses static analysis and symbolic execution to detect common vulnerabilities and generate security reports.",
        "github_url": "https://github.com/hackhub/safevault",
        "tech_stack": ["Python", "Solidity", "Slither", "FastAPI", "React"],
        "status": Submission.STATUS_UNDER_REVIEW,
        "final_score": 82.0,
        "rank": None,
    },
    {
        "team_index": 6,
        "project_title": "VitalLink: Telemedicine Platform",
        "description": "A comprehensive telemedicine solution with video consultations, AI-powered symptom checker, prescription management, and integration with hospital systems. Built for rural healthcare access.",
        "github_url": "https://github.com/hackhub/vitallink",
        "tech_stack": ["Python", "Django", "React Native", "WebRTC", "PostgreSQL"],
        "status": Submission.STATUS_ACCEPTED,
        "final_score": 92.0,
        "rank": 1,
    },
    {
        "team_index": 7,
        "project_title": "MediTrack: Patient Care System",
        "description": "End-to-end patient care coordination platform with appointment scheduling, medical records management, prescription tracking, and insurance claim processing automation.",
        "github_url": "https://github.com/hackhub/meditrack",
        "tech_stack": ["Node.js", "React", "MongoDB", "Docker", "Redis"],
        "status": Submission.STATUS_ACCEPTED,
        "final_score": 85.0,
        "rank": 2,
    },
    {
        "team_index": 3,
        "project_title": "EcoMonitor: Environmental Sensing Network",
        "description": "IoT-based environmental monitoring system using low-cost sensors to track air quality, water quality, and soil conditions. Data is visualized on a real-time dashboard.",
        "github_url": "https://github.com/hackhub/ecomonitor",
        "tech_stack": ["Python", "Arduino", "React", "InfluxDB", "Grafana"],
        "status": Submission.STATUS_SUBMITTED,
        "final_score": 0,
        "rank": None,
    },
]

SCORES_DATA = [
    # (submission_index, judge_index, criteria_scores, total_score, feedback, is_finalized)
    {
        "submission_index": 2,
        "judge_index": 3,
        "criteria_scores": [
            {"name": "Medical Impact", "score": 28},
            {"name": "Technical Quality", "score": 24},
            {"name": "Usability", "score": 22},
            {"name": "Business Potential", "score": 18},
        ],
        "total_score": 92,
        "feedback": "Excellent telemedicine solution with strong AI integration. The symptom checker is particularly impressive.",
        "is_finalized": True,
    },
    {
        "submission_index": 2,
        "judge_index": 4,
        "criteria_scores": [
            {"name": "Medical Impact", "score": 27},
            {"name": "Technical Quality", "score": 23},
            {"name": "Usability", "score": 23},
            {"name": "Business Potential", "score": 17},
        ],
        "total_score": 90,
        "feedback": "Very polished product. Great attention to accessibility and rural healthcare needs.",
        "is_finalized": True,
    },
    {
        "submission_index": 3,
        "judge_index": 3,
        "criteria_scores": [
            {"name": "Medical Impact", "score": 25},
            {"name": "Technical Quality", "score": 22},
            {"name": "Usability", "score": 20},
            {"name": "Business Potential", "score": 18},
        ],
        "total_score": 85,
        "feedback": "Solid healthcare platform. Good feature set but the AI components could be more advanced.",
        "is_finalized": True,
    },
    {
        "submission_index": 3,
        "judge_index": 4,
        "criteria_scores": [
            {"name": "Medical Impact", "score": 24},
            {"name": "Technical Quality", "score": 21},
            {"name": "Usability", "score": 21},
            {"name": "Business Potential", "score": 19},
        ],
        "total_score": 85,
        "feedback": "Comprehensive platform with good market potential. UX could be improved.",
        "is_finalized": True,
    },
    {
        "submission_index": 0,
        "judge_index": 3,
        "criteria_scores": [
            {"name": "Technical Implementation", "score": 27},
            {"name": "Innovation", "score": 24},
            {"name": "Security", "score": 22},
            {"name": "Documentation", "score": 17},
        ],
        "total_score": 90,
        "feedback": "Impressive decentralized identity solution. Zero-knowledge proof implementation is solid.",
        "is_finalized": True,
    },
    {
        "submission_index": 1,
        "judge_index": 4,
        "criteria_scores": [
            {"name": "Technical Implementation", "score": 25},
            {"name": "Innovation", "score": 21},
            {"name": "Security", "score": 20},
            {"name": "Documentation", "score": 16},
        ],
        "total_score": 82,
        "feedback": "Useful security tool. The static analysis is thorough, but could benefit from more detailed reporting.",
        "is_finalized": True,
    },
]


class Command(BaseCommand):
    help = "Populate database with comprehensive seed data for development"

    def handle(self, *args, **options):
        self.stdout.write("🌱 Seeding HackHub database...\n")

        # ─── Users ───
        self.stdout.write("  👥 Creating users...")
        created_users = {}
        for email, username, password, role, first_name, last_name, skills, verified in USERS_DATA:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": username,
                    "role": role,
                    "first_name": first_name,
                    "last_name": last_name,
                    "skills": skills,
                    "is_email_verified": verified,
                },
            )
            if created:
                user.set_password(password)
                user.save()
            created_users[username] = user
            self.stdout.write(f"    {'✅' if created else '🔁'} {email} ({role})")

        # ─── Hackathons ───
        self.stdout.write("\n  🏗️  Creating hackathons...")
        created_hackathons = []
        organizer = created_users["organizer1"]
        for h_data in HACKATHONS_DATA:
            hackathon, created = Hackathon.objects.get_or_create(
                title=h_data["title"],
                defaults={
                    "organizer": organizer,
                    "status": h_data["status"],
                    "description": h_data["description"],
                    "registration_start": h_data["registration_start"],
                    "registration_end": h_data["registration_end"],
                    "start_date": h_data["start_date"],
                    "end_date": h_data["end_date"],
                    "submission_deadline": h_data["submission_deadline"],
                    "team_settings": h_data.get("team_settings", {}),
                    "prizes": h_data.get("prizes", []),
                    "scoring_criteria": h_data.get("scoring_criteria", []),
                },
            )
            created_hackathons.append(hackathon)
            self.stdout.write(f"    {'✅' if created else '🔁'} {hackathon.title} ({hackathon.status})")

        # Second organizer hackathon
        org2_hack, _ = Hackathon.objects.get_or_create(
            title="DevOps & Cloud Native Hackathon",
            defaults={
                "organizer": created_users["organizer2"],
                "status": Hackathon.STATUS_PUBLISHED,
                "description": "Build cloud-native applications and DevOps tooling. Kubernetes, Docker, CI/CD pipelines, and infrastructure as code.",
                "registration_start": _d(5),
                "registration_end": _d(25),
                "start_date": _d(30),
                "end_date": _d(33),
                "submission_deadline": _d(32, 23),
                "team_settings": {"min_size": 1, "max_size": 5, "allow_solo": True},
                "prizes": [{"rank": 1, "title": "Cloud Champion", "value": "$6,000"}],
                "scoring_criteria": [{"name": "Architecture", "maxScore": 30, "weight": 0.30}, {"name": "Innovation", "maxScore": 25, "weight": 0.25}],
            },
        )
        created_hackathons.append(org2_hack)
        self.stdout.write(f"    ✅ {org2_hack.title} ({org2_hack.status})")

        # ─── Assign Judges ───
        self.stdout.write("\n  ⚖️  Assigning judges...")
        judge1 = created_users["judge1"]
        judge2 = created_users["judge2"]
        judge_assignments = [
            (0, judge1),
            (0, judge2),
            (1, judge1),
            (2, judge2),
            (3, judge1),
            (3, judge2),
        ]
        for hack_idx, judge in judge_assignments:
            _, created = HackathonJudge.objects.get_or_create(
                hackathon=created_hackathons[hack_idx],
                user=judge,
            )
            self.stdout.write(f"    ✅ {judge.username} → {created_hackathons[hack_idx].title}")

        # ─── Register Participants ───
        self.stdout.write("\n  📋 Registering participants...")
        participant_users = [created_users[f"participant{i}"] for i in range(1, 6)]
        registrations = [
            # (hackathon_index, participant_index)
            (0, 0), (0, 1), (0, 2),
            (1, 2), (1, 3), (1, 4),
            (2, 0), (2, 1), (2, 2), (2, 4),
            (3, 0), (3, 1), (3, 3), (3, 4),
            (5, 0), (5, 1), (5, 3),
        ]
        for hack_idx, p_idx in registrations:
            _, created = HackathonParticipant.objects.get_or_create(
                hackathon=created_hackathons[hack_idx],
                user=participant_users[p_idx],
                defaults={"status": HackathonParticipant.STATUS_REGISTERED},
            )
            self.stdout.write(f"    ✅ {participant_users[p_idx].username} → {created_hackathons[hack_idx].title}")

        # ─── Teams ───
        self.stdout.write("\n  👥 Creating teams...")
        created_teams = []
        for name, hack_idx, leader_idx, member_indices, status, skills in TEAMS_DATA:
            team, created = Team.objects.get_or_create(
                name=name,
                hackathon=created_hackathons[hack_idx],
                defaults={
                    "leader": participant_users[leader_idx],
                    "status": status,
                    "looking_for_skills": skills,
                },
            )
            # Add leader membership
            TeamMembership.objects.get_or_create(
                team=team,
                user=participant_users[leader_idx],
                defaults={"role": TeamMembership.ROLE_LEADER},
            )
            # Add member memberships
            for m_idx in member_indices:
                TeamMembership.objects.get_or_create(
                    team=team,
                    user=participant_users[m_idx],
                    defaults={"role": TeamMembership.ROLE_MEMBER},
                )
            created_teams.append(team)
            self.stdout.write(f"    ✅ {name}")

        # ─── Team Invitations & Join Requests ───
        self.stdout.write("\n  📨 Creating team invitations & requests...")
        # Invite participant3 to team 0
        TeamInvitation.objects.get_or_create(
            team=created_teams[0],
            invited_user=participant_users[2],
            invited_by=participant_users[0],
            defaults={"status": TeamInvitation.STATUS_PENDING},
        )
        # Join request for team 1 from participant2
        TeamJoinRequest.objects.get_or_create(
            team=created_teams[1],
            user=participant_users[1],
            defaults={"status": TeamJoinRequest.STATUS_PENDING},
        )
        self.stdout.write("    ✅ Created pending invitations and requests")

        # ─── Submissions ───
        self.stdout.write("\n  📝 Creating submissions...")
        for sub_data in SUBMISSIONS_DATA:
            team = created_teams[sub_data["team_index"]]
            _, created = Submission.objects.get_or_create(
                team=team,
                defaults={
                    "project_title": sub_data["project_title"],
                    "description": sub_data["description"],
                    "github_url": sub_data["github_url"],
                    "tech_stack": sub_data["tech_stack"],
                    "status": sub_data["status"],
                    "final_score": sub_data["final_score"],
                },
            )
            self.stdout.write(f"    {'✅' if created else '🔁'} {sub_data['project_title']}")

        # ─── Scores ───
        self.stdout.write("\n  ⭐ Creating scores...")
        for score_data in SCORES_DATA:
            submission = Submission.objects.filter(
                team=created_teams[score_data["submission_index"]]
            ).first()
            if submission:
                judge = list(created_users.values())[3 + score_data["judge_index"]]
                SubmissionScore.objects.get_or_create(
                    submission=submission,
                    judge=judge,
                    defaults={
                        "criteria_scores": score_data["criteria_scores"],
                        "total_score": score_data["total_score"],
                        "feedback": score_data["feedback"],
                        "is_finalized": score_data["is_finalized"],
                    },
                )
                self.stdout.write(f"    ✅ Score: {score_data['total_score']} by {judge.username}")

        # Update final scores on submissions for completed hackathon
        for sub in Submission.objects.filter(team__hackathon__status=Hackathon.STATUS_COMPLETED):
            scores = sub.scores.filter(is_finalized=True)
            if scores.exists():
                avg = sum(s.total_score for s in scores) / scores.count()
                sub.final_score = avg
                sub.save(update_fields=["final_score"])

        # ─── Certificates for completed hackathon ───
        self.stdout.write("\n  🏅 Issuing certificates...")
        completed_hack = created_hackathons[3]
        participants = HackathonParticipant.objects.filter(
            hackathon=completed_hack,
            status=HackathonParticipant.STATUS_REGISTERED,
        )
        for p in participants:
            issue_certificate(
                user_id=p.user_id,
                hackathon_id=completed_hack.id,
                metadata={"source": "seed_data"},
            )
        self.stdout.write(f"    ✅ Certificates issued for {participants.count()} participants")

        # ─── Notifications ───
        self.stdout.write("\n  🔔 Creating sample notifications...")
        notification_data = [
            (0, "results:published", "Results Published!", "The HealthTech Hackathon results are now available. Check your certificates!", {"hackathon_id": created_hackathons[3].id}),
            (0, "certificate:ready", "Certificate Ready", "Your HealthTech Hackathon certificate is ready for verification.", {}),
            (1, "team:invite", "Team Invitation", "You've been invited to join AI Wizards!", {"team_id": created_teams[0].id}),
            (2, "team:join_request", "New Join Request", "Grace Lee wants to join your team.", {"team_id": created_teams[1].id}),
            (0, "hackathon:announcement", "Reminder: AI Challenge", "The AI Innovation Challenge starts in 3 weeks! Start forming your teams.", {"hackathon_id": created_hackathons[0].id}),
        ]
        for user_idx, event_type, title, body, metadata in notification_data:
            Notification.objects.create(
                user=participant_users[user_idx],
                event_type=event_type,
                title=title,
                body=body,
                metadata=metadata,
            )
        self.stdout.write("    ✅ Sample notifications created")

        # ─── Refresh Stats ───
        self.stdout.write("\n  📊 Refreshing hackathon stats...")
        from apps.hackathons.services import refresh_hackathon_stats
        for hack in created_hackathons:
            refresh_hackathon_stats(hack.id)
        self.stdout.write("    ✅ Stats refreshed")

        # ─── Summary ───
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write("📊 SEED DATA SUMMARY")
        self.stdout.write("=" * 50)
        self.stdout.write(f"  Users:         {User.objects.count()}")
        self.stdout.write(f"  Hackathons:    {Hackathon.objects.count()}")
        self.stdout.write(f"  Participants:  {HackathonParticipant.objects.count()}")
        self.stdout.write(f"  Judges:        {HackathonJudge.objects.count()}")
        self.stdout.write(f"  Teams:         {Team.objects.count()}")
        self.stdout.write(f"  Memberships:   {TeamMembership.objects.count()}")
        self.stdout.write(f"  Submissions:   {Submission.objects.count()}")
        self.stdout.write(f"  Scores:        {SubmissionScore.objects.count()}")
        self.stdout.write(f"  Certificates:  {Certificate.objects.count()}")
        self.stdout.write(f"  Notifications: {Notification.objects.count()}")
        self.stdout.write("=" * 50)
        self.stdout.write("\n✅ Database seeded successfully!")
        self.stdout.write("\n📧 Test Accounts:")
        self.stdout.write("   Admin:       admin@hackhub.io / password123")
        self.stdout.write("   Organizer:   organizer@hackhub.io / password123")
        self.stdout.write("   Judge:       judge@hackhub.io / password123")
        self.stdout.write("   Mentor:      mentor@hackhub.io / password123")
        self.stdout.write("   Participant: participant@hackhub.io / password123")
        self.stdout.write("\n⚡ All accounts use password: password123")