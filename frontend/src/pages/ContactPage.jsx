export function ContactPage() {
  return (
    <div className="page-grid">
      <section className="card">
        <h2>Contact Us</h2>
        <form className="form-grid">
          <input placeholder="Full name" />
          <input type="email" placeholder="Email" />
          <input placeholder="Subject" />
          <textarea placeholder="Message" />
          <button className="btn" type="button">
            Send Message
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Support Information</h2>
        <div className="list">
          <article className="list-item"><strong>Email</strong><p>support@hackhub.ai</p></article>
          <article className="list-item"><strong>FAQ</strong><p>Common platform and billing questions</p></article>
          <article className="list-item"><strong>Offices</strong><p>Addis Ababa, Nairobi, Berlin</p></article>
          <article className="list-item"><strong>Response Time</strong><p>Typically within 4 hours</p></article>
        </div>
      </section>
    </div>
  );
}
