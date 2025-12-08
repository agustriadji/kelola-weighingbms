export interface SysMenuState {
  loadingState: boolean;
  setLoadingState: (loadingState: boolean) => void;

  activeMenuState: string;
  setActiveMenuState: (activeMenu: string) => void;

  activeModalState: string;
  setActiveModalState: (activeModal: string) => void;
  resetModalState: () => void;
}
