import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text
} from '@react-email/components';

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  phone,
  service,
  message,
}: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>Nuevo mensaje de contacto de {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://fascinantedigital.com/logo.png"
            width="120"
            height="40"
            alt="Fascinante Digital"
            style={logo}
          />
        </Section>

        <Heading style={h1}>Nuevo mensaje de contacto</Heading>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Nombre:</strong> {name}
          </Text>
          <Text style={infoText}>
            <strong>Email:</strong> {email}
          </Text>
          {phone && (
            <Text style={infoText}>
              <strong>Teléfono:</strong> {phone}
            </Text>
          )}
          {service && (
            <Text style={infoText}>
              <strong>Servicio:</strong> {service}
            </Text>
          )}
        </Section>

        <Section style={messageBox}>
          <Heading style={h2}>Mensaje:</Heading>
          <Text style={messageText}>{message}</Text>
        </Section>

        <Section style={footerBox}>
          <Text style={footerText}>
            📧 Enviado desde fascinantedigital.com<br />
            🕐 {new Date().toLocaleString('es-ES')}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#6366f1',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const infoText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const messageBox = {
  backgroundColor: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const footerBox = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
};

const footerText = {
  margin: '0',
  fontSize: '14px',
  color: '#1976d2',
};

export default ContactEmail;
