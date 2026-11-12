import styles from  './Footer.module.css'

export const Footer = ({ Info }: { Info: string }) => {

  const ano = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
        <section>
            <p className={styles.paragrafoFooter}>&copy; {ano}&ensp;Terê Verde. Todos os direitos reservados. </p>

            <div className={styles.paragrafoFooter}>
                <p>{Info}</p>
            </div>
        </section>
    </footer>
  )
}
