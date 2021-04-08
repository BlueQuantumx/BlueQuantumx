# Linux 折腾笔记

这个主要是记录一下折腾的详细条目，防止以后重装系统后忘掉。。。

## Common

- `~/.vimrc` 的配置
- `/usr/share/X11/xkb/keycodes` 里修改caps/meta
- `/usr/share/fcitx/data/` 修改字符映射（￥--> $ ）
- `/etc/fstab` 挂载 `/tmp` 到内存
- `~/.local/share/mime/packages/[Any Name].xml` 添加自定义类型
- update-mime-database ~/.local/share/mime 刷新mime数据库

## Deepin
- dde-top-panel
- `sudo apt install vim-gtk3`（支持系统剪贴板）
- /etc/modules msr
- libfprint-dev.deb

## Manjaro

- ```sh
  yay -S kmscon
  sudo systemctl disable getty@tty2.service
  sudo systemctl enable kmsconvt@tty2.service
  ```
- ```
  yay -S seahorse
  yay -S qtkeychain
  /etc/pam.d/sddm << "auth optional pam_gnome_keyring.so" << "session optional pam_gnome_keyring.so auto_start"
  ```
- `yay -S gvim`（支持系统剪贴板）