import styles from './GitVersion.module.css'; 

export default function GitHash() {
    return (
      <div className={styles.gitVersion}>
        Commit date: {__COMMIT_DATE__}, Commit hash: {__COMMIT_HASH__}
      </div>
    );
  };
  
  