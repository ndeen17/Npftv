> Reference only. This is the v0.1 PRD draft from an earlier brainstorming session (November 2026). It describes the full future product, not the demo. Where it disagrees with `docs/demo-plan.md`, the demo plan wins for this build.

# NPFTV DIGITAL PLATFORM
## Product Requirements Document (PRD)

**Product:** Nigeria Police Force Television Digital Ecosystem  
**Products:** NPFTV, NPFTV Stream and NPFTV Administration  
**Version:** 0.1  
**Status:** Working Draft  
**Document purpose:** Define the product vision, scope, functional requirements, technical expectations and implementation direction for the redevelopment of NPFTV's digital platforms.

---

# 1. Executive Summary

The NPFTV Digital Platform will be a connected digital broadcasting, journalism and public information ecosystem for the Nigeria Police Force.

The project will deliver three connected systems:

1. **NPFTV:** The primary institutional website for news, programmes, public safety information, institutional communication and public engagement.
2. **NPFTV Stream:** A dedicated streaming platform offering live television and video-on-demand. It will operate independently while remaining accessible from the main NPFTV website.
3. **NPFTV Administration:** A central management environment for publishing content, managing broadcasts, maintaining the media library, managing programmes and controlling staff access.

The project will be approached as a redevelopment rather than an assumption that the existing implementation should be preserved.

Existing content, branding, domain assets and useful information may be migrated following assessment. Existing software and infrastructure will be evaluated independently before any reuse decision.

## 1.1 Confirmed initial product decisions

| Decision | Agreed direction |
|---|---|
| Existing source code | Access unknown; investigate |
| Streaming | Live TV and video-on-demand |
| Viewer accounts | Not required |
| Broadcast arrangement | Existing traditional television broadcast infrastructure |
| Delivery priority | Complete ecosystem delivered in structured phases |
| Main website and streaming relationship | Separate products, connected through shared infrastructure |
| Administration | Central management platform |

## 1.2 Product vision

To establish NPFTV as a modern national television and public information network that informs, educates, documents, connects and serves the Nigerian public through accessible digital broadcasting and verified information.

---

# 2. Product Objectives

The platform should achieve the following objectives:

1. Establish a professional digital presence for NPFTV.
2. Make live NPFTV broadcasts accessible through the internet.
3. Provide an organised archive of recorded programmes and broadcasts.
4. Improve the publication and distribution of verified news and official information.
5. Give NPFTV staff a reliable content and broadcast management environment.
6. Improve public access to safety education and official information.
7. Establish a digital platform capable of supporting national and international audiences.
8. Reduce fragmented content management and duplicated publishing activities.
9. Improve content discoverability, accessibility and engagement.
10. Provide management with useful reporting on platform performance.

## 2.1 Success indicators

The following are proposed measurements. Numerical targets should be established after baseline assessment and stakeholder agreement.

- Website availability and response times.
- Successful live-stream playback sessions.
- Video playback start success rate.
- Streaming interruption and error rates.
- Number of published articles and programmes.
- Content publishing turnaround time.
- Media library usage and video engagement.
- Mobile performance and accessibility results.
- Administrative workflow completion and error rates.
- Number of public enquiries successfully received and routed.

---

# 3. Target Users and Audiences

## 3.1 Public audiences

**General public:** Visitors seeking news, official information, television broadcasts and public safety education.

**Television viewers:** People who want to watch NPFTV live or access previously broadcast content.

**Journalists and media organisations:** Users seeking official statements, photographs, videos, interviews and media resources.

**Researchers and institutions:** Users accessing institutional information, documentaries, historical material and official publications.

**Nigerians abroad and international audiences:** Users who want access to NPFTV content outside Nigeria.

## 3.2 Internal users

**Network management:** Oversees the platform, broadcasting operations, content standards and performance.

**Editorial team:** Produces, reviews and publishes news and institutional content.

**Broadcast team:** Coordinates digital streaming, broadcast status and programme scheduling.

**Programme team:** Manages programme information, presenters, episodes and schedules.

**Media team:** Manages video, audio, photography and digital assets.

**Regional contributors:** Submit approved news material and media from state commands.

**System administrators:** Manage access, configurations, integrations and technical operations.

---

# 4. Product Architecture and Relationship

## 4.1 NPFTV: Main website

NPFTV will be the primary institutional and public information destination.

It will provide the main navigation, newsroom, programme information, public safety resources, institutional information and access to NPFTV Stream.

## 4.2 NPFTV Stream: Standalone streaming product

NPFTV Stream will be a dedicated streaming experience.

It will provide:

- Live television.
- Video-on-demand.
- Programme and episode discovery.
- Broadcast schedules.
- Live event coverage.
- Search and content categorisation.
- Responsive playback across supported devices.

It will have its own homepage, navigation and identity within the NPFTV brand.

Proposed address: `stream.npftv.net`

## 4.3 Shared infrastructure

The two public products should use shared services where appropriate.

These may include:

- Central content management.
- Shared media library.
- Programme and episode data.
- Broadcast schedule information.
- Search infrastructure.
- Analytics and reporting.
- Staff identity and permissions.
- Common branding and design components.

The two public products should remain independently accessible. A failure in one public-facing application should not automatically make the other inaccessible.

## 4.4 Proposed logical architecture

The proposed architecture consists of:

1. NPFTV public website.
2. NPFTV Stream public application.
3. Shared backend/API services.
4. Central CMS and administration.
5. Content and media storage.
6. Video processing and delivery infrastructure.
7. Traditional broadcast feed integration.
8. Monitoring, security and analytics services.

The exact deployment architecture and technology stack remain subject to technical discovery.

---

# 5. NPFTV Main Website Requirements

## 5.1 Homepage

The homepage must communicate that NPFTV is a national television network.

**Requirements**

- Display official NPFTV branding.
- Provide clear primary navigation.
- Feature prominent access to Watch Live.
- Display approved breaking news and latest updates.
- Display a lead story or featured video.
- Show supporting news stories.
- Feature selected programmes.
- Display recent videos and media content.
- Provide access to public safety information.
- Display approved announcements and institutional updates.
- Provide links to verified social media accounts.
- Allow authorised administrators to manage homepage content without developer intervention.

The homepage must be responsive and manageable through the CMS.

## 5.2 Newsroom

The newsroom will provide a structured publishing environment for official news and approved public-interest reporting.

**Proposed categories**

- National News
- Police News
- IGP's Activities
- Operational Updates
- State Commands
- Investigations
- Community Policing
- Public Safety
- Official Statements
- Press Releases
- International Relations
- Human Interest

**Article requirements**

Each article should support:

- Headline.
- Slug and URL.
- Category.
- Featured image.
- Image caption and alternative text.
- Summary or introduction.
- Full article content.
- Author or newsroom attribution.
- Publication date and time.
- Last updated date.
- Related images and videos.
- Related articles.
- Social sharing metadata.
- Search engine metadata.
- Draft, scheduled, published and withdrawn states.

**Editorial requirements**

- Create and edit articles.
- Save drafts.
- Submit content for review.
- Approve or reject submissions.
- Schedule publication.
- Publish and unpublish articles.
- Correct previously published articles.
- Maintain revision history.
- Record who created, edited, approved or withdrew content.

Official statements and sensitive institutional content must follow the appropriate approval process.

## 5.3 Programmes

Every NPFTV programme should have a dedicated page.

Each programme should support:

- Programme name.
- Description.
- Logo or artwork.
- Programme category.
- Presenter or host information.
- Broadcast schedule.
- Episode duration.
- Promotional video.
- Previous episodes.
- Upcoming episodes.
- Related articles and media.

Initial programmes to verify include The Beat, Safe Nigeria, Community Watch, The Force in Focus, In Conversation and Cyber Sense.

These names are starting references, not a confirmed final programme inventory.

## 5.4 Public Safety

The Public Safety section will provide accessible, verified educational material and approved public advisories.

Content areas may include:

- Personal safety.
- Cybercrime and online fraud awareness.
- Crime prevention.
- Road safety.
- Emergency preparedness.
- Community policing.
- Human trafficking awareness.
- Citizens' rights and responsibilities.
- Official reporting and contact information.

### Public safety alerts

The platform should support approved notices and advisories.

Each alert should include:

- Alert title and description.
- Issuing authority.
- Publication date and time.
- Geographic relevance.
- Alert category.
- Current status.
- Expiry or review date.
- Supporting official information.

Alerts must pass an appropriate approval process.

The website must clearly communicate that it is not an emergency dispatch service.

## 5.5 State Commands

The platform should support state-based reporting across Nigeria's 36 states and the Federal Capital Territory.

Requirements:

- State and FCT landing pages.
- Approved regional news and reports.
- State-based content filtering.
- Regional photographs and videos.
- Source attribution and submission dates.
- Secure submission access for authorised contributors.
- Central editorial review before publication.

Regional contributors must not have unrestricted direct-publishing privileges.

## 5.6 Media Centre

The Media Centre should provide access to approved NPFTV media assets.

It should support:

- Photography archives.
- Video collections.
- Downloadable media resources.
- Image captions and descriptions.
- Publication dates.
- Event information.
- Copyright and permissions information.
- Media enquiries.

Download permissions must be configurable.

## 5.7 Institutional Information

The About NPFTV section should provide accurate and approved institutional information.

It should support:

- NPFTV mandate.
- Vision and mission.
- Leadership.
- Organisational structure.
- Departmental information.
- Network history.
- Official documents.
- Editorial guidelines.
- Media accreditation information.
- Partnership information.
- Links to official Nigeria Police Force resources.

## 5.8 Contact and Engagement

The platform should provide clear contact routes.

Proposed enquiry categories:

- General enquiries.
- Newsroom.
- Media relations.
- Partnerships.
- Programming.
- Production.
- Technical support.
- Photography and media permissions.
- Corrections and feedback.

The platform should include appropriate privacy notices and spam protection.

---

# 6. NPFTV Stream Requirements

NPFTV Stream is a major independent product within the ecosystem.

## 6.1 Streaming homepage

The streaming homepage should prioritise watching and discovering content.

It should include:

- Prominent live television player or live broadcast entry point.
- Current broadcast status.
- Current programme information.
- Next scheduled programme.
- Featured programmes.
- Recently added episodes.
- Popular or featured videos.
- Content categories.
- Search.
- Broadcast schedule.

## 6.2 Live television

The live television experience must allow visitors to watch the existing NPFTV television broadcast through the internet.

**Core requirements**

- Dedicated Live TV page.
- Professional embedded video player.
- Live status indicator.
- Current programme information.
- Full-screen playback.
- Responsive mobile playback.
- Adaptive streaming quality.
- Playback error handling.
- Automatic reconnection where supported.
- Clear off-air state.
- Next programme information.
- Support for approved live event broadcasts.

### Broadcast integration

The confirmed starting assumption is that NPFTV already has traditional broadcast infrastructure.

The digital platform must therefore integrate with an approved broadcast feed.

The implementation must establish:

1. Where the digital streaming feed will originate.
2. How the existing broadcast signal will be captured or provided.
3. Whether a broadcast encoder or contribution encoder is required.
4. Which streaming provider or delivery infrastructure will be used.
5. How the feed will be converted into internet-compatible streaming formats.
6. How stream health will be monitored.
7. What fallback arrangements will be available if the primary feed fails.

HLS or an equivalent suitable adaptive streaming approach should be evaluated.

The project must not assume that the existing television signal is automatically available in an internet-ready format.

## 6.3 Off-air experience

When no live broadcast is available, visitors should see an intentional off-air experience.

It should display:

- Clear off-air status.
- Next scheduled programme.
- Broadcast schedule.
- Featured recorded programmes.
- Other videos available to watch.

The platform must never leave a permanent loading state or broken player visible.

## 6.4 Video-on-demand

Visitors should be able to access recorded NPFTV content without needing an account.

Requirements:

- Searchable video library.
- Category filters.
- Programme filters.
- Publication date filters.
- Video thumbnails.
- Titles and descriptions.
- Duration information.
- Responsive playback.
- Related videos.
- Programme and episode associations.
- Shareable video URLs.

Video content should be organised into manageable categories.

Potential categories include:

- News.
- Interviews.
- Documentaries.
- Public Safety.
- Community Policing.
- Official Events.
- Police Activities.
- Programmes.
- Podcasts.
- Special Reports.

## 6.5 Electronic Programme Guide

The platform should provide a digital television schedule.

Requirements:

- Daily and weekly programme views.
- Current programme indicator.
- Upcoming programmes.
- Programme duration.
- Broadcast dates and times.
- Timezone displayed as West Africa Time (WAT).
- Links to programme and episode pages.
- CMS-managed schedule information.

The schedule must reflect approved broadcast commitments rather than illustrative sample information.

## 6.6 Live events and premieres

The system should support special scheduled digital broadcasts.

Examples include:

- Official events.
- Press briefings.
- Public awareness campaigns.
- Interviews.
- Special programmes.
- Scheduled premieres.

These broadcasts should have configurable titles, descriptions, start times, promotional images and stream destinations.

## 6.7 Viewer accounts

**Decision: Viewer accounts are not required.**

The platform should provide public access without requiring registration or login.

This means:

- Visitors can watch live television without an account.
- Visitors can watch available recorded content without an account.
- Visitors can browse schedules and programmes without an account.
- No mandatory registration or login wall should interrupt playback.

Staff administration accounts are separate and remain mandatory.

Personalised features such as cross-device viewing history and account-based watchlists are not part of the initial scope.

---

# 7. NPFTV Administration Platform

The administration environment will be the operational centre for the ecosystem.

It should provide one central place to manage content and the services shared by NPFTV and NPFTV Stream.

## 7.1 Dashboard

The dashboard should provide an overview of:

- Published articles.
- Pending editorial approvals.
- Scheduled publications.
- Active and upcoming broadcasts.
- Video library activity.
- Programme schedules.
- Recent administrative actions.
- Platform performance indicators.
- System alerts.

Dashboard information should be permission-aware.

## 7.2 Content management

Administrators should be able to:

- Create and manage pages.
- Publish announcements.
- Manage navigation.
- Feature homepage content.
- Manage news categories.
- Upload and manage images.
- Update institutional information.
- Schedule content.
- Preview content before publishing.
- Manage metadata and SEO settings.

## 7.3 Broadcast management

Authorised broadcast staff should be able to:

- View the current broadcast configuration.
- Monitor the reported stream status.
- Manage live broadcast information.
- Set the current programme.
- Configure upcoming programme information.
- Manage approved live event entries.
- Configure off-air messages.
- Update fallback stream information where authorised.

The actual broadcast encoder, streaming provider and infrastructure may have their own operational dashboards. The NPFTV administration platform should integrate with them where technically supported.

## 7.4 Media management

Administrators should be able to:

- Upload media.
- Edit media metadata.
- Manage thumbnails.
- Organise assets into categories.
- Associate media with programmes and articles.
- Manage captions and descriptions.
- Control download permissions.
- Archive or withdraw assets.

The system should preserve media metadata and content relationships during migration.

## 7.5 Programme management

Administrators should be able to:

- Create programmes.
- Edit programme information.
- Manage presenters.
- Create episodes.
- Upload episode media.
- Schedule broadcasts.
- Associate episodes with programmes.
- Publish episode pages.
- Manage programme artwork.

## 7.6 User and access management

Staff accounts must use secure authentication.

The system should support:

- Account creation.
- Account suspension and deactivation.
- Role assignment.
- Permission management.
- Multi-factor authentication.
- Password reset procedures.
- Login activity monitoring.
- Administrative audit logs.

### Initial roles

| Role | Main responsibility |
|---|---|
| Super Administrator | Full system administration |
| Network Director | Management oversight |
| Editor-in-Chief | Editorial oversight and approvals |
| News Editor | Newsroom management |
| Reporter | Article and media submissions |
| Broadcast Manager | Broadcast and stream operations |
| Programme Manager | Programme and episode management |
| Media Manager | Media library administration |
| Public Information Officer | Approved public information |
| Analyst | Reporting and read-only insights |

Permissions should be granular and configurable.

## 7.7 Editorial workflow

The proposed article workflow is:

**Draft → Submitted for Review → Approved → Scheduled or Published**

Additional states should include:

- Rejected.
- Returned for Revision.
- Withdrawn.
- Archived.

The system must retain an audit history of significant editorial actions.

---

# 8. Search and Discovery

Search should operate across the public content ecosystem.

Visitors should be able to find:

- News articles.
- Programmes.
- Episodes.
- Videos.
- Public safety resources.
- Institutional pages.
- Media resources.

Search should support relevant filters and useful empty states.

The relationship between NPFTV and NPFTV Stream search should be defined during technical design. The objective is to make content discoverable without creating unnecessary duplication.

---

# 9. Non-Functional Requirements

## 9.1 Performance

The platform should be optimised for Nigerian mobile networks and international visitors.

Proposed web performance targets:

| Metric | Target |
|---|---|
| Largest Contentful Paint | ≤ 2.5 seconds |
| Interaction to Next Paint | ≤ 200 ms |
| Cumulative Layout Shift | ≤ 0.1 |
| Lighthouse Performance | 90+ target |

These targets should be measured separately on mobile and desktop.

Video streaming performance should be measured independently from website performance.

## 9.2 Availability and reliability

The platform should be designed for high availability.

Requirements:

- Monitoring of public applications.
- Monitoring of streaming services.
- Error logging.
- Automated alerting.
- Backup and restoration procedures.
- Documented incident response.
- Recovery procedures.
- Redundancy appropriate to the selected hosting and streaming architecture.

Availability targets and recovery objectives must be agreed with stakeholders and infrastructure providers.

## 9.3 Security

Requirements:

- HTTPS and valid TLS certificates.
- Web Application Firewall and appropriate DDoS protection.
- Secure authentication.
- Multi-factor authentication for administrative accounts.
- Role-based access control.
- Least-privilege permissions.
- Login rate limiting.
- Secure session management.
- Input validation and output encoding.
- Protection against common web vulnerabilities.
- Secure file uploads.
- Audit logs.
- Regular security updates.
- Tested backups.
- Incident response procedures.

A security assessment must be completed before production launch.

## 9.4 Accessibility

The platform should target WCAG 2.2 AA.

Requirements include:

- Keyboard navigation.
- Visible focus states.
- Screen-reader-compatible controls.
- Appropriate colour contrast.
- Meaningful image alternative text.
- Captions for video content where available.
- Transcripts for interviews where practical.
- Reduced-motion support.
- Accessible forms and error messages.

## 9.5 Device compatibility

The products must support:

- Smartphones.
- Tablets.
- Laptops.
- Desktop computers.
- Large screens and television browsers where supported.

Common viewport widths should be tested, including 360px, 390px, 768px, 1024px and 1440px.

## 9.6 Search engine optimisation

Requirements:

- Descriptive page titles.
- Unique meta descriptions.
- Canonical URLs.
- XML sitemaps.
- Robots.txt.
- Structured data where appropriate.
- Open Graph metadata.
- Search-friendly URLs.
- News and video metadata.
- Proper indexing controls.

## 9.7 Language support

The architecture should allow future support for:

- English.
- Hausa.
- Yoruba.
- Igbo.
- Nigerian Pidgin.

The initial language rollout and translation workflow require stakeholder approval.

Official and sensitive public information must use reviewed translations.

---

# 10. Analytics and Reporting

The platform should provide useful operational and management reporting.

## Website analytics

- Visitors and sessions.
- Page views.
- Popular articles.
- Search activity.
- Traffic sources.
- Device categories.
- Geographic distribution where appropriately collected.

## Streaming analytics

- Live viewing sessions.
- Total viewing time.
- Video starts.
- Playback completion.
- Playback errors.
- Average viewing duration.
- Stream availability.
- Concurrent viewer estimates.
- Video popularity.

## Administration analytics

- Published content.
- Editorial approval turnaround.
- Content contributions by authorised staff.
- Scheduled publications.
- Administrative activity.
- System health.

Analytics must respect applicable privacy requirements. Since viewer accounts are not required, analytics should not depend on identifying individual viewers.

---

# 11. Integrations and External Dependencies

The following integrations should be assessed during discovery.

| Integration | Purpose | Status |
|---|---|---|
| Existing TV broadcast feed | Source for digital live streaming | To investigate |
| Broadcast encoder | Convert or prepare broadcast contribution feed | To assess |
| Streaming provider/CDN | Deliver live and recorded video | To select |
| Video storage | Store recorded programmes and media | To select |
| Existing social channels | Distribute content and highlights | To verify |
| Analytics platform | Platform reporting | To select |
| Search engine tools | Indexing and SEO reporting | To configure |
| Email service | Administrative and contact notifications | To select |
| Security services | WAF, DDoS protection and monitoring | To select |

No streaming provider or technology stack is considered approved at this stage.

---

# 12. Data and Content Management

The platform should support the following core data entities:

- User and Role.
- Permission.
- Article.
- Article Category.
- Page.
- Announcement.
- Public Safety Alert.
- Programme.
- Episode.
- Broadcast Schedule.
- Live Stream.
- Video Asset.
- Audio Asset.
- Image Asset.
- Media Category.
- State Command.
- Contributor Submission.
- Contact Enquiry.
- Editorial Revision.
- Audit Log.

Relationships should be designed to avoid duplicate records where the same programme, video or article is displayed across both public products.

Content migration should preserve important identifiers, publication dates, media relationships and existing URLs where practical.

---

# 13. Migration and Redevelopment Strategy

The project will not assume that the existing website's implementation is reliable.

The existing system should be assessed in four areas:

**1. Content and assets**

Identify useful articles, photographs, videos, programme information, institutional documents and approved branding assets.

**2. Existing software**

Inspect the source code, frameworks, APIs, database, CMS, authentication and integrations if access is available.

**3. Existing infrastructure**

Review domains, hosting, DNS, SSL, storage, backups, broadcast connections and third-party services.

**4. Existing functionality**

Test each visible feature to establish whether it works, partially works or does not work.

### Migration decisions

Each existing component should be classified as:

- Reuse.
- Rebuild.
- Replace with a third-party service.
- Retire.
- Investigate further.

Migration must include a content verification and quality assurance process.

---

# 14. Delivery Roadmap

The project should be delivered in controlled phases, with the complete ecosystem as the overall objective.

## Phase 1: Discovery and technical assessment

- Stakeholder interviews.
- Existing website functional audit.
- Source code and infrastructure assessment.
- Broadcast infrastructure discovery.
- Content and media inventory.
- Product architecture.
- Finalised requirements and acceptance criteria.

**Deliverable:** Approved PRD and technical architecture.

## Phase 2: Core platform foundation

- Application architecture.
- Database and backend services.
- Shared API layer.
- Authentication and staff permissions.
- Central administration foundation.
- Media storage foundation.
- Deployment environments.
- Monitoring and security baseline.

**Deliverable:** Functional platform foundation.

## Phase 3: NPFTV website

- Homepage.
- Navigation.
- Newsroom.
- Article pages.
- Programme pages.
- Public Safety.
- Institutional information.
- Media Centre.
- Contact and engagement.

**Deliverable:** Functional NPFTV public website.

## Phase 4: NPFTV Stream

- Streaming homepage.
- Traditional broadcast feed integration.
- Live TV player.
- Off-air experience.
- Video-on-demand.
- Programme and episode library.
- Electronic Programme Guide.
- Search and discovery.
- Streaming analytics.

**Deliverable:** Functional standalone streaming platform integrated into NPFTV.

## Phase 5: Administration and operational workflows

- Editorial workflow.
- Media management.
- Broadcast management.
- Programme management.
- State contributor submission.
- User and role management.
- Analytics dashboards.

Some administration capabilities will be developed earlier where required by the public products.

**Deliverable:** Complete central administration environment.

## Phase 6: Quality assurance and launch

- Functional testing.
- Security assessment.
- Performance testing.
- Streaming load testing.
- Mobile and browser compatibility.
- Accessibility testing.
- Content migration verification.
- Staff training.
- Production deployment.
- Handover documentation.

**Deliverable:** Production-ready ecosystem.

## Phase 7: Post-launch improvements

Potential enhancements:

- Multilingual publishing.
- Advanced analytics.
- Podcast distribution.
- Improved content recommendations.
- Expanded state reporting workflows.
- Additional public engagement services.

---

# 15. Acceptance Criteria

The platform will not be considered complete merely because pages have been designed or APIs have been implemented.

The following must be demonstrated.

## NPFTV

- Visitors can access all approved public sections.
- News articles can be published through the CMS.
- Editorial approval works according to configured permissions.
- Programmes and episodes display correctly.
- Search returns relevant content.
- Public safety information is clearly presented.
- Contact enquiries are successfully received and routed.
- Pages work across supported devices.

## NPFTV Stream

- Visitors can access streaming without registering.
- The live player successfully receives the approved broadcast feed.
- The platform displays the correct live or off-air state.
- The player handles interruptions and errors gracefully.
- Recorded videos can be browsed and played.
- Programme schedules reflect approved information.
- Streaming works across supported mobile and desktop browsers.
- Load testing demonstrates agreed viewing capacity.

## Administration

- Staff can authenticate securely.
- Permissions restrict unauthorised actions.
- Articles can be created, reviewed, approved and published.
- Media can be uploaded and managed.
- Programmes and schedules can be maintained.
- Broadcast information can be updated by authorised staff.
- Important actions are recorded in audit logs.
- Backups and recovery procedures are tested.

## Platform-wide

- Performance targets are measured.
- Security review is completed.
- Accessibility testing is documented.
- SEO configuration is verified.
- Production monitoring is active.
- Technical and operational documentation is handed over.

---

# 16. Risks and Dependencies

| Risk or dependency | Potential impact | Required response |
|---|---|---|
| Unknown source code access | Delays technical assessment | Confirm repository and ownership |
| Unknown broadcast feed format | Streaming integration uncertainty | Conduct broadcast engineering discovery |
| Unconfirmed streaming capacity | Risk of playback failure under high demand | Establish audience estimates and load-test |
| Unclear content ownership | Migration and publishing delays | Obtain approved content inventory |
| Unconfirmed editorial authority | Publishing workflow may not reflect real operations | Interview editorial stakeholders |
| Third-party streaming dependency | Availability and cost implications | Evaluate providers and fallback options |
| Incomplete staff requirements | Administration may not match real workflows | Conduct role-based discovery |
| Existing URL changes | Search traffic and broken links | Plan redirects and migration |
| Unverified security configuration | Operational and reputational risk | Complete security assessment |

---

# 17. Out of Scope for the Initial Release

Unless specifically approved, the following are not part of the initial release:

- Mandatory viewer registration.
- Paid subscriptions or pay-per-view.
- User-generated public video uploads.
- Public comments and open discussion forums.
- Unmoderated citizen reporting.
- Emergency dispatch functionality.
- Replacement of the traditional television production and transmission infrastructure.
- A native mobile application.
- Personalised cross-device watch history.

These may be considered separately after the core platform is operational.

---

# 18. Outstanding Product Decisions

The following require confirmation before the PRD can be treated as approved.

1. Official NPFTV brand guidelines, logo files and visual assets.
2. Actual list of active programmes and approved schedules.
3. Broadcast feed source, format and technical specifications.
4. Expected concurrent streaming audience.
5. Streaming infrastructure budget and provider preferences.
6. Existing hosting, domain and infrastructure ownership.
7. Staff departments and their actual responsibilities.
8. Editorial approval hierarchy.
9. State command contribution and verification process.
10. Existing content volume and migration priorities.
11. Required language rollout.
12. Data retention and privacy requirements.
13. Production support and incident escalation responsibilities.

---

# 19. First Project Milestone

The first milestone is **Product Discovery and Technical Assessment**.

It should produce five tangible deliverables:

1. Approved product scope and stakeholder requirements.
2. Existing website functional audit.
3. Source code, hosting and infrastructure assessment.
4. Traditional broadcast-to-digital streaming integration assessment.
5. Final system architecture and implementation backlog.

Development should begin with the shared platform foundation once the architecture and critical dependencies are understood.

---

# 20. Product Definition Summary

NPFTV is the primary institutional and public information platform.

NPFTV Stream is the connected but independently accessible live and on-demand streaming product.

NPFTV Administration is the central operational environment that manages content, media, programmes, broadcasts and staff access.

Together, these products form one connected digital ecosystem.

**The objective is not simply to give NPFTV a new website. It is to establish a complete digital broadcasting and public information platform that NPFTV can operate, manage and grow over time.**
