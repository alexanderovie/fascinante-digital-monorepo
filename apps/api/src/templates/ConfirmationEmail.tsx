import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text
} from '@react-email/components';

interface ConfirmationEmailProps {
  name: string;
}

export const ConfirmationEmail = ({ name }: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Gracias por contactarnos! - Fascinante Digital</Preview>
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

        <Heading style={h1}>¡Gracias por contactarnos!</Heading>

        <Text style={greeting}>Hola {name},</Text>

        <Text style={paragraph}>
          Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.
        </Text>

        <Section style={nextStepsBox}>
          <Heading style={h2}>¿Qué sigue?</Heading>
          <Text style={listItem}>• Revisaremos tu solicitud en las próximas 24 horas</Text>
          <Text style={listItem}>• Te contactaremos por email o teléfono</Text>
          <Text style={listItem}>• Programaremos una consulta gratuita si es necesario</Text>
        </Section>

        <Section style={ctaContainer}>
          <Button style={button} href="https://fascinantedigital.com">
            Visitar nuestro sitio
          </Button>
        </Section>

        <Section style={contactBox}>
          <Text style={contactText}>
            <strong>Fascinante Digital</strong><br />
            📞 (800) 886-4981<br />
            📧 info@fascinantedigital.com
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

const greeting = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const nextStepsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const contactBox = {
  marginTop: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const contactText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

export default ConfirmationEmail;
