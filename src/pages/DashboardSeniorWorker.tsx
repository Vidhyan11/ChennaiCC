import { DashboardWorker } from './DashboardWorker';

// Senior Worker dashboard is identical to Worker but with different salary/bonus rates
// The differences are handled by the user data itself
export const DashboardSeniorWorker: React.FC = () => {
  return <DashboardWorker />;
};
