import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import config from "@/config"

// Email de bienvenida después del primer login (Sem 1/2).
export default function Welcome({ name = "" }) {
  const appName = config.app.name
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || config.app.defaultUrl
  const greeting = name ? `Hola ${name},` : "Hola,"

  return (
    <Html lang={config.app.locale}>
      <Head />
      <Preview>{`Bienvenido a ${appName}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={h1}>Bienvenido a {appName} 👋</Heading>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>
              Tu cuenta quedó lista. Entra a tu dashboard y empieza a construir.
            </Text>
            <Button style={button} href={`${appUrl}${config.auth.afterLoginUrl}`}>
              Ir al dashboard
            </Button>
            <Text style={footer}>
              {appName} · {config.landing.footer.tagline}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: "#f6f6f6", fontFamily: "system-ui, sans-serif" }
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "480px",
  borderRadius: "12px",
}
const h1 = { fontSize: "22px", fontWeight: "700", color: "#111111" }
const text = { fontSize: "15px", lineHeight: "24px", color: "#444444" }
const button = {
  backgroundColor: config.brand.primary,
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
}
const footer = { fontSize: "12px", color: "#999999", marginTop: "24px" }
