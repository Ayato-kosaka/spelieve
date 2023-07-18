import { TPA001FooterMenuController } from '../Controller/FooterMenuController';

export interface TPA001BorderColorPickerDialogPropsInterface {
	selectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['selectedFooterMenu'];
	setSelectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['setSelectedFooterMenu'];
}
