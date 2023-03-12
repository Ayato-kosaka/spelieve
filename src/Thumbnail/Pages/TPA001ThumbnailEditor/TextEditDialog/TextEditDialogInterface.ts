import { TPA001FooterMenuController } from '../Controller/FooterMenuController';

export interface TPA001TextEditDialogPropsInterface {
	selectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['selectedFooterMenu'];
	setSelectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['setSelectedFooterMenu'];
	deleteDecoration: ReturnType<typeof TPA001FooterMenuController>['deleteDecoration'];
}
