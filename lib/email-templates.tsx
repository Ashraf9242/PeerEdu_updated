
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const logoUrl = `${baseUrl}/images/peeredu-logo.png`;

interface BaseEmailTemplateProps {
  preview: string;
  children: React.ReactNode;
}

export const BaseEmailTemplate = ({ preview, children }: BaseEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Tailwind>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={logoUrl} width="150" height="30" alt="PeerEdu Logo" />
          </Section>
          {children}
          <Section style={footer}>
            <Hr style={hr} />
            <Row>
              <Column align="left" style={{ width: '50%' }}>
                <Text style={footerText}>PeerEdu</Text>
              </Column>
              <Column align="right" style={{ width: '50%' }}>
                <Link href={`${baseUrl}/unsubscribe`} style={footerLink}>
                  Unsubscribe
                </Link>
              </Column>
            </Row>
            <Text style={footerText}>
              © {new Date().getFullYear()} PeerEdu, Inc. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const WelcomeEmail = ({ name }: { name: string }) => (
  <BaseEmailTemplate preview="Welcome to PeerEdu!">
    <Heading style={heading}>Welcome to PeerEdu, {name}!</Heading>
    <Text style={paragraph}>
      We're excited to have you on board. PeerEdu is a community for sharing knowledge and skills.
    </Text>
    <Section style={buttonContainer}>
      <Button style={button} href={`${baseUrl}/profile`}>
        Complete Your Profile
      </Button>
      <Button style={button} href={`${baseUrl}/tutors`}>
        Find a Tutor
      </Button>
    </Section>
    <Text style={paragraph}>
      To get started, you can complete your profile or start searching for tutors right away.
    </Text>
  </BaseEmailTemplate>
);

export const BookingRequestEmail = ({ tutorName, studentName, subject, date, time, duration }: { tutorName: string, studentName: string, subject: string, date: string, time: string, duration: string }) => (
    <BaseEmailTemplate preview="New Booking Request!">
        <Heading style={heading}>New Booking Request from {studentName}</Heading>
        <Text style={paragraph}>Hi {tutorName}, you have a new booking request:</Text>
        <Text style={paragraph}>
            <strong>Student:</strong> {studentName}<br/>
            <strong>Subject:</strong> {subject}<br/>
            <strong>Date:</strong> {date}<br/>
            <strong>Time:</strong> {time}<br/>
            <strong>Duration:</strong> {duration}
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/teacher?action=accept`}>Accept Request</Button>
            <Button style={button} href={`${baseUrl}/dashboard/teacher?action=reject`}>Reject Request</Button>
        </Section>
    </BaseEmailTemplate>
);

export const BookingConfirmedEmail = ({ studentName, tutorName, subject, date, time, meetingLink }: { studentName: string, tutorName: string, subject: string, date: string, time: string, meetingLink: string }) => (
    <BaseEmailTemplate preview="Your booking is confirmed!">
        <Heading style={heading}>Booking Confirmed!</Heading>
        <Text style={paragraph}>Hi {studentName}, your booking with {tutorName} has been confirmed.</Text>
        <Text style={paragraph}>
            <strong>Tutor:</strong> {tutorName}<br/>
            <strong>Subject:</strong> {subject}<br/>
            <strong>Date:</strong> {date}<br/>
            <strong>Time:</strong> {time}
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={meetingLink}>View Details</Button>
        </Section>
        <Text style={paragraph}>
            Don't forget to add this to your calendar!
        </Text>
    </BaseEmailTemplate>
);

export const BookingRejectedEmail = ({ studentName, tutorName, reason }: { studentName: string, tutorName: string, reason?: string }) => (
    <BaseEmailTemplate preview="Your booking was not accepted.">
        <Heading style={heading}>Booking Not Accepted</Heading>
        <Text style={paragraph}>Hi {studentName}, unfortunately your booking request with {tutorName} was not accepted.</Text>
        {reason && <Text style={paragraph}><strong>Reason:</strong> {reason}</Text>}
        <Text style={paragraph}>
            Don't worry! There are many other great tutors available.
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/tutors`}>Find Another Tutor</Button>
        </Section>
    </BaseEmailTemplate>
);

export const SessionReminderEmail = ({ studentName, tutorName, subject, date, time, meetingLink }: { studentName: string, tutorName: string, subject: string, date: string, time: string, meetingLink: string }) => (
    <BaseEmailTemplate preview="Session Reminder">
        <Heading style={heading}>Reminder: Your session is in 24 hours</Heading>
        <Text style={paragraph}>Hi {studentName}, this is a reminder for your upcoming session with {tutorName}.</Text>
        <Text style={paragraph}>
            <strong>Subject:</strong> {subject}<br/>
            <strong>Date:</strong> {date}<br/>
            <strong>Time:</strong> {time}
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={meetingLink}>Join Session</Button>
        </Section>
    </BaseEmailTemplate>
);

export const SessionCompletedEmail = ({ studentName, tutorName }: { studentName: string, tutorName: string }) => (
    <BaseEmailTemplate preview="Your session is complete!">
        <Heading style={heading}>Session Completed!</Heading>
        <Text style={paragraph}>Hi {studentName}, your session with {tutorName} has been completed.</Text>
        <Text style={paragraph}>We'd love to hear your feedback. Please take a moment to rate your experience.</Text>
        <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/tutors/${tutorName}/review`}>Rate Your Experience</Button>
        </Section>
    </BaseEmailTemplate>
);

export const NewReviewEmail = ({ tutorName, studentName, rating, comment }: { tutorName: string, studentName: string, rating: number, comment: string }) => (
    <BaseEmailTemplate preview="You have a new review!">
        <Heading style={heading}>You've Received a New Review!</Heading>
        <Text style={paragraph}>Hi {tutorName}, {studentName} left you a review:</Text>
        <Text style={paragraph}>
            <strong>Rating:</strong> {'⭐'.repeat(rating)}<br/>
            <strong>Comment:</strong> {comment}
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/teacher/reviews`}>View All Reviews</Button>
        </Section>
    </BaseEmailTemplate>
);

export const TutorApprovedEmail = ({ tutorName }: { tutorName: string }) => (
    <BaseEmailTemplate preview="You're approved as a tutor!">
        <Heading style={heading}>Congratulations! You're a PeerEdu Tutor!</Heading>
        <Text style={paragraph}>Hi {tutorName}, we're thrilled to approve your application. Welcome to the team!</Text>
        <Text style={paragraph}>
            Here are the next steps:
            1. Set up your availability in your dashboard.
            2. Make sure your profile is complete to attract students.
            3. Share your profile with your network.
        </Text>
        <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/teacher`}>Go to Dashboard</Button>
        </Section>
    </BaseEmailTemplate>
);

export const TutorRejectedEmail = ({ name, reason }: { name: string, reason?: string }) => (
    <BaseEmailTemplate preview="Update on your tutor application.">
        <Heading style={heading}>Update on Your Tutor Application</Heading>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
            Thank you for your interest in becoming a tutor at PeerEdu. After careful consideration, we regret to inform you that we cannot approve your application at this time.
        </Text>
        {reason && <Text style={paragraph}><strong>Reason:</strong> {reason}</Text>}
        <Text style={paragraph}>
            You are welcome to re-apply in the future if you believe you meet the requirements.
        </Text>
    </BaseEmailTemplate>
);


// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const header = {
  padding: '0 48px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#333',
  padding: '0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
  padding: '0 48px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  padding: '12px 0',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
  margin: '0 5px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
};

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '15px',
};

const footerLink = {
  color: '#8898aa',
  textDecoration: 'underline',
};
