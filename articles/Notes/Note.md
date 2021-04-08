# Misc

$$
f_if_j + f_{i+1}f_{j+1} = f_{i + j + 1}
$$

$$
M = 
\begin{bmatrix}
1 \ 1 \\
1 \ 0
\end{bmatrix}
$$

$$
M^a = 
\begin{bmatrix}
fib_{a+1} \ fib_a \\
fib_a \ fib_{a-1}
\end{bmatrix}
$$

$$
f_{n+1}f_{n-1} - f_nf_n = (-1)^n \\
f_{n-1}f_{n-1} - f_{n-2}f_n
$$

遇到最值选择问题记得想堆

SAM点数 $2N-1$ 边数 $3N-4$

Tarjan求割点时不用阻断连向父亲的边

## 2021-03-15

树上的路径情况数真的没那么多，一定要敢于大力分类讨论

## P3733 [HAOI2017]八纵八横

bitset维护线性基

并查集一定要初始化

引用必须初始化

特判P=0

不必要时不重用数组

address只能检测global-buffer和堆内存越界，static不行

## P5675 [GZOI2017]取石子游戏

异或会使值域扩大至2的次幂

## 2021_04_05

关于两个集合的交并，考虑补集转换，枚举子集
