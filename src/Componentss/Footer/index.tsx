import styles from  './Footer.module.css'

export const Footer = ({ Info }: { Info: string }) => {
  return (
    <footer>
        <section>
            <p className={styles.paragrafoFooter}>&copy 2025&ensp;Terê Verde. Todos os direitos reservados. </p>

            <div className={styles.paragrafoFooter}>
                <p>{Info}</p>
            </div>
        </section>
    </footer>
  )
}
