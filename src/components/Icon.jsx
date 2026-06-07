export default function Icon({ name, className }) {
    return (<span className={className ? `material-symbols-outlined ${className}` : 'material-symbols-outlined'}>
      {name}
    </span>);
}
