/**
 * FileUploadArea Component
 * Design: Minimalismo Corporativo Moderno
 * Função: Área de upload com drag-and-drop para arquivos CSV
 */

import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  label: string;
  accept?: string;
  disabled?: boolean;
}

export default function FileUploadArea({
  onFileSelect,
  label,
  accept = '.csv',
  disabled = false
}: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center
        transition-all duration-200 ease-in-out
        ${disabled
          ? 'border-border bg-secondary/30 cursor-not-allowed opacity-60'
          : 'border-border bg-secondary/10 cursor-pointer hover:border-primary hover:bg-primary/5'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-label={label}
      />

      <div className="flex flex-col items-center gap-3">
        <Upload className="w-10 h-10 text-primary" strokeWidth={1.5} />
        
        <div>
          <p className="font-semibold text-foreground text-base">
            {label}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Arraste um arquivo aqui ou clique para selecionar
          </p>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Formato: CSV (separado por ponto-e-vírgula)
        </p>
      </div>
    </div>
  );
}
