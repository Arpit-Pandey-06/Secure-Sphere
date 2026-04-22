
import {theme} from "../../styles/theme"

export default function SeverityBadge({ severity }) {
  const map = { 
    critical:[theme.red,theme.redGlow],
     high:[theme.amber,theme.amberGlow], 
     medium:[theme.purple,theme.purpleGlow], 
     low:[theme.green,theme.greenGlow] 
    };

  const [color, glow] = map[severity] || [theme.textSecondary,"transparent"];

  return (
    <span className="mono" 
    style={
        { 
        fontSize:11,
         padding:"2px 8px",
     borderRadius:3,
      border:`1px solid ${color}`,
       color, background:glow,
        textTransform:"uppercase", letterSpacing:1 
        }
        }>
      {severity}
    </span>
  );
}
