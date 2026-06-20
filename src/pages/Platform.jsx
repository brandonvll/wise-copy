import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Photo } from '../components/Mockups.jsx'

// La página Platform de Wise es global y se muestra en inglés (igual que el sitio real).
const logos = ['Monzo', 'Google Pay', 'Mandiri', 'Shinhan', 'Bancolombia', 'Ramp']

const features = [
  ['globe', 'Real time, dependable correspondent services', 'Move money across borders with speed, transparency and reliability.'],
  ['zap', 'Connect seamlessly to low-cost payouts', 'Reach 160+ countries through a single integration with Wise.'],
  ['card', 'Plug-in products to lower costs and boost loyalty', 'Offer multi-currency accounts and cards under your own brand.'],
  ['shield', 'Deliver fast, dependable global payouts', 'Settle payments quickly with full visibility at every step.'],
]

export default function Platform() {
  return (
    <>
      {/* HERO */}
      <section className="bg-forest">
        <div className="container-wise grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="display-hero mb-6 text-bright-green">Infrastructure to power the world's money</h1>
            <p className="mb-8 max-w-md text-lg text-bright-green/80">
              Banks, financial institutions and businesses connect to our global network to move money faster and cheaper.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="#" className="btn-primary px-7 py-3.5 text-lg">Get in touch</Link>
              <Link to="#" className="btn-link text-bright-green">Explore the API</Link>
            </div>
          </div>
          <Photo src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" className="aspect-[4/3] w-full" />
        </div>
      </section>

      {/* LOGOS */}
      <section className="container-wise py-16">
        <p className="mb-8 text-center text-content-tertiary">Trusted by leading organisations globally</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
          {logos.map((l) => (
            <span key={l} className="text-2xl font-bold text-content-secondary">{l}</span>
          ))}
        </div>
      </section>

      {/* VOLUMEN */}
      <section className="bg-bright-green py-16 md:py-24">
        <div className="container-wise text-center">
          <h2 className="display-h2-caps mx-auto max-w-4xl text-forest">
            We move £181BN+ of global FX volumes – and growing
          </h2>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-wise py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {features.map(([icon, title, text]) => (
            <div key={title} className="rounded-card-lg border border-black/10 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bright-green text-forest">
                <Icon name={icon} size={24} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
              <p className="text-content-secondary">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-wise pb-24">
        <div className="rounded-card-lg bg-forest px-6 py-16 text-center">
          <h2 className="display-h2 mx-auto mb-6 max-w-2xl text-bright-green">Partnering with us</h2>
          <p className="mx-auto mb-8 max-w-xl text-bright-green/80">
            Let's build the future of cross-border payments together.
          </p>
          <Link to="#" className="btn-primary px-7 py-3.5">Get in touch</Link>
        </div>
      </section>
    </>
  )
}
