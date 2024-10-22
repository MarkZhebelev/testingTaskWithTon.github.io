import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
            <Image
                className={styles.logo}
                src="https://nextjs.org/icons/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
            <ol>
                <li>
                    Подключение кошелька:{" "}
                    <Link href="/wallet">
                        <code>http://localhost:3000/wallet</code>
                    </Link>
                </li>
                <li>
                    Транзакция:{" "}
                    <Link href="/transaction">
                        <code>http://localhost:3000/transaction</code>
                    </Link>
                </li>
            </ol>
        </main>
    </div>
  );
}
