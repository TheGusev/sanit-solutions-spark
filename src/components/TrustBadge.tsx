 import { FileCheck, Shield, Receipt } from "lucide-react";
 
 const TrustBadge = () => (
   <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4 px-4 md:px-6 bg-muted/50 rounded-xl border border-border">
     <div className="flex items-center gap-2 text-sm">
       <FileCheck className="w-4 h-4 text-primary flex-shrink-0" />
       <span>Договор</span>
     </div>
     <div className="flex items-center gap-2 text-sm">
       <Shield className="w-4 h-4 text-success flex-shrink-0" />
       <span>Гарантия до 1 года</span>
     </div>
     <div className="flex items-center gap-2 text-sm">
       <Receipt className="w-4 h-4 text-russia-red flex-shrink-0" />
       <span>Документы СЭС</span>
     </div>
   </div>
 );
 
 export default TrustBadge;