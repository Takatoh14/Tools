export type TitleProps = {
  title?: string;
  titleName: string;
};

export type CardProps = {
  title: string;
  url?: string;
};

export type Tool = {
  title: string;
  url: string;
};

export type TextField = {
  name: string;
  rows: number;
  placeholder: string;
  textStyle: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
};

export type ReplaceTextOption = {
  title: string;
  inputId: string;
  inputName?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkId?: string;
  checkName?: string;
  checkLabel?: string;
  checked?: boolean;
  onCheck?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
